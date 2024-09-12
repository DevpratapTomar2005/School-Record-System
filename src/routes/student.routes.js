const express = require('express')

const router=express.Router()
const studentControllers=require('../controllers/student.controllers.js')

router.post("/student-register", studentControllers.studentRegister)
router.post("/student-login", studentControllers.studentLogin)
module.exports=router;