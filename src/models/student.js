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
    attendence: {
        type: Number,
    },
    lastmarked: {type:Date},
    testscore: {type:Number},
    refreshToken: {type:String}
});



const student = mongoose.model('Student', studentSchema);
module.exports = student;