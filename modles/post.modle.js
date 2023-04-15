const mongoose = require("mongoose");

const postScheema = mongoose.Schema({
    title:{type:String},
    disc:{type:String},
    user:{type:String}
})

const postModle = mongoose.model("post",postScheema);
module.exports={postModle};