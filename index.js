require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cookie_parsre = require("cookie-parser")
const {connection} = require("./config/db.coonect");
const {userRouter } = require("./routes/userRoute")
const {postRouter } = require("./routes/postRoutes")
const {validator } = require("./middleware/tokenValidator")

var whitelist = ['http://127.0.0.1:5501']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

const app= express();
app.use(express.json())
app.use(cors(corsOptions))
app.use(cookie_parsre())

app.use("/user",userRouter)
app.use("/post",validator)
app.use("/post",postRouter)
app.get("/",(req,res)=>{
    res.status(202).send({msg:`welcome to shubham's app`})
})

app.listen(process.env.PORT,async()=>{
    try{
        await connection
        console.log("connected to db...")
    }catch(err){
        console.log(err.message)
    }
    console.log(process.env.PORT)
})
