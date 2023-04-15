const mongoose = require("mongoose");

const userScheema = mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String},
    password:{type:String},
    role:{type:String,enum:["user"],default:"user"}
})

const userModle = mongoose.model("user",userScheema);
module.exports={userModle};