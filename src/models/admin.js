const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const adminSchema=new Schema({
    emailid:{
        type:String,
        unique: true,
        required:true
    },
    schoolname:{
        type:String,
        required: true
    },
    contactnum:{
        type:Number,
        max:9999999999,
        unique:true,
        required:true

    },
    password:{
        type:String,
        required:true
    },
 
   imagepath:String
   
});
const admin=mongoose.model('Admin',adminSchema);
module.exports=admin;