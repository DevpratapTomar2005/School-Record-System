const express = require('express')
const studentControllers=require('../controllers/student.controllers.js')
const router=express.Router()

const {verifyStudent}=require('../middlewares/student.auth.js')
const {upload}=require('../middlewares/multer.uploadpfp')

router.get('/',verifyStudent,studentControllers.studentIndex)
router.post("/register", studentControllers.studentRegister)
router.post("/login", studentControllers.studentLogin)
router.get("/logout", verifyStudent,studentControllers.studentLogout)
router.get("/refreshtoken",studentControllers.refreshAccessToken)
router.post('/upload-student-profile',verifyStudent,upload.single('userProfile'),studentControllers.updateProfilePath)
router.get('/student-dashboard',verifyStudent,studentControllers.studentDashboard)
module.exports=router;