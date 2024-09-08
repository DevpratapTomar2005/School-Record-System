const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const teacherSchema=new Schema({
    firstname:{
        type: String,
        required: [true,'firstname is required']

    },
    lastname:{
        type:String,
        required: [true,'firstname is required']

    },
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
    gender:{
        type:String,
        enum:['male','female'],
        required:true
    },
    password:{
        type:String,
        required:true
    },
   subject:{
    type:String,
    required:true
   },
   imagepath:String
   
});
const teacher=mongoose.model('Teacher',teacherSchema);
module.exports=teacher;