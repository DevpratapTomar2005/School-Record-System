const express = require('express')

const router=express.Router()
const teacherControllers=require('../controllers/teacher.controllers.js')
const { verifyTeacher } = require('../middlewares/teacher.auth.js')


router.get("/",verifyTeacher ,teacherControllers.teacherIndex)
router.post("/register", teacherControllers.teacherRegister)
router.post("/login", teacherControllers.teacherLogin)
router.get('/logout',verifyTeacher,teacherControllers.teacherLogout)
router.get('/refreshToken',teacherControllers.refreshAccessToken)
module.exports=router;