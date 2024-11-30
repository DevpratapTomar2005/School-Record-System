
const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const studentSchema = new Schema({
    firstname: {
        type: String,
        required: true

    },
    lastname: {
        type: String,
        required: true

    },
    rollnum: {
        type: Number,
        unique: true,
        required: true
    },
    schoolname: {
        type: String,
        required: true
    },
    contactnum: {
        type: Number,
        max: 9999999999,
        unique: true,
        required: true

    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    password: {
        type: String,
        required: true
    },
    class: {
        type: Number,
        max: 12,
        required: true
    },
    imagepath: {type:String},
   
   
    testscore: [{
        subject:{type:String},
        examName:{type:String},
        maxMarks:{type:Number},
        obtainedMarks:{type:Number},
        markedDate:{type:String},
        
    }],
    refreshToken: {type:String},
   attendence:[{
    firstname:{type:String},
    lastname:{type:String},
    rollnumber:{type:Number},
    studentClass:{type:Number},
    studentAttendence:{type:String},
    attendenceDate:{type:String}
   }],
    homeworks:[{
        subject:{type:String},
        teachername:{type:String},
        date:{type:String},
        task:{type:String}
    }]
});



const student = mongoose.model('Student', studentSchema);
module.exports = student;