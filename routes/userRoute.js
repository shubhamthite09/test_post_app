require("dotenv").config();
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const {Router} = require("express")
const { v4: uuidv4 } = require("uuid");
const { passport } = require("../config/google.auth");
const {userModle} = require("../modles/user.modle");
const {blackModle} = require("../modles/blacklist");

const userRouter = Router()

userRouter.post("/reg",async(req,res)=>{
    try{
        const {email} = req.body
        const isPresent = await userModle.findOne({email})
        if(isPresent){
            res.status(405).send({msg:`bhai to login kar le`})
        }else{
            req.body.password = await bcrypt.hash(req.body.password,3)
            let newUser = new userModle(req.body)
            await newUser.save()
            res.status(202).send({msg:`User created done.`})
        }
    }catch(err){
        res.status(505).send({msg:`internal`})
    }
})

userRouter.post("/log",async(req,res)=>{
    try{
        const {email} = req.body
        const isPresent = await userModle.findOne({email})
        if(!isPresent){
            res.status(405).send({msg:`bhai to regester kar le`})
        }else{
            const isPassCorrect = await bcrypt.compare(req.body.password,isPresent.password)
            if(!isPassCorrect){
                res.status(405).send({msg:`password galt hai`})
            }else{
                const token = jwt.sign({id:isPresent._id,role:isPresent.role},process.env.token_key,{expiresIn:"35s"})
                const refresh_token = jwt.sign({id:isPresent._id,role:isPresent.role},process.env.refresh_key,{expiresIn:"1m"})
                res.cookie("token",token,{maxAge:1000*35})
                res.cookie("refresh_token",refresh_token,{maxAge:1000*200})
                res.status(202).send({msg:`login done`})
            }
        }
    }catch(err){
        res.status(505).send({msg:`internal`})
    }
})

userRouter.post("/logout",async(req,res)=>{
    try{
        const {token,refresh_token}=req.cookies;
        let newToken = new blackModle({token})
        let newRefToken = new blackModle({token:refresh_token})
        await newToken.save()
        await newRefToken.save()
        res.status(202).send({msg:`Logout done`})
    }catch(err){
        res.status(505).send({msg:`internal`})
    }
})

//google outh here
userRouter.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  
  userRouter.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login",
      session: false,
    }),
    async function (req, res) {
      const isPresent = await userModle.findOne({ email: req.user.email });
      if (isPresent) {
        const token = jwt.sign({id:isPresent._id,role:isPresent.role},process.env.token_key,{expiresIn:"35s"})
                const refresh_token = jwt.sign({id:isPresent._id,role:isPresent.role},process.env.refresh_key,{expiresIn:"1m"})
                res.cookie("token",token,{maxAge:1000*35})
                res.cookie("refresh_token",refresh_token,{maxAge:1000*69})
                res.status(202).send({msg:`login done`})
      } else {
        req.user.password = bcrypt.hashSync(req.user.password, 2);
        const user = new userModle(req.user);
        await user.save();
        const isPresent = await userModle.findOne({ email: req.user.email });
        const token = jwt.sign({id:isPresent._id,role:isPresent.role},process.env.token_key,{expiresIn:"35s"})
                const refresh_token = jwt.sign({id:isPresent._id,role:isPresent.role},process.env.refresh_key,{expiresIn:"1m"})
                res.cookie("token",token,{maxAge:1000*35})
                res.cookie("refresh_token",refresh_token,{maxAge:1000*69})
                res.status(202).send({msg:`login done`})
      }
    }
  );

module.exports={userRouter}

