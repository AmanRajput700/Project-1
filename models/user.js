const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
    
    email:{
        type:String,
        required:true
    }
});

//plugin will automatically give user and password to shcema and 
//do hashing and slating by itself
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);