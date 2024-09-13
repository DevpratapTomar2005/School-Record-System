const express = require('express')

const router=express.Router()
const studentControllers=require('../controllers/student.controllers.js')

router.post("/register", studentControllers.studentRegister)
router.post("/login", studentControllers.studentLogin)
module.exports=router;