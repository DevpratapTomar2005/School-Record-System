const express = require('express')
const {verifyStudent}=require('../middlewares/student.auth.js')
const router=express.Router()

const studentControllers=require('../controllers/student.controllers.js')
router.get('/',verifyStudent,studentControllers.studentIndex)
router.post("/register", studentControllers.studentRegister)
router.post("/login", studentControllers.studentLogin)
router.get("/logout", verifyStudent,studentControllers.studentLogout)
router.post("/refreshtoken",studentControllers.refreshAccessToken)

module.exports=router;