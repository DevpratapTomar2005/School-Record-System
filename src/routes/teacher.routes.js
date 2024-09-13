const express = require('express')

const router=express.Router()
const teacherControllers=require('../controllers/teacher.controllers.js')

router.post("/register", teacherControllers.teacherRegister)
router.post("/login", teacherControllers.teacherLogin)
module.exports=router;