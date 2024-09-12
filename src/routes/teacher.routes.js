const express = require('express')

const router=express.Router()
const teacherControllers=require('../controllers/teacher.controllers.js')

router.post("/teacher-register", teacherControllers.teacherRegister)
router.post("/teacher-login", teacherControllers.teacherLogin)
module.exports=router;