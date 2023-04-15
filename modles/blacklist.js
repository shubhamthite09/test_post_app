const mongoose = require("mongoose");

const blackScheema = mongoose.Schema({
    token:{type:String}
})

const blackModle = mongoose.model("black",blackScheema);
module.exports={blackModle};