
const {Router} = require("express")
const {postModle} = require("../modles/post.modle");
const {authorization} = require("../middleware/tokenValidator");

const postRouter = Router()

postRouter.post("/new",async(req,res)=>{
    try{
            let newUser = new postModle(req.body)
            await newUser.save()
            res.status(202).send({msg:`post created done.`})
    }catch(err){
        res.status(505).send({msg:`internal`})
    }
})

postRouter.get("/all",async(req,res)=>{
    try{
            let all = await postModle.find({user:req.body.user})
            console.log(all)
            res.status(202).send(all)
    }catch(err){
        res.status(505).send({msg:`internal`})
    }
})

postRouter.patch("/:id",authorization,async(req,res)=>{
    try{
            await postModle.findByIdAndUpdate({_id:req.params.id},req.body)
            res.status(202).send({msg:`updated done`})
    }catch(err){
        res.status(505).send({msg:`internal`})
    }
})

postRouter.delete("/:id",authorization,async(req,res)=>{
    try{
        await postModle.findByIdAndDelete({_id:req.params.id})
        res.status(202).send({msg:`updated done`})
}catch(err){
    res.status(505).send({msg:`internal`})
}
})


module.exports={postRouter}
