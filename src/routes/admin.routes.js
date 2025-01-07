const express = require('express')
const {verifyAdmin}=require('../middlewares/admin.auth.js')
const router=express.Router()
const adminControllers=require('../controllers/admin.controllers.js')

const {upload}=require('../middlewares/multer.uploadpfp.js')
router.get('/',verifyAdmin,adminControllers.adminIndex)
router.post("/register", adminControllers.adminRegister)
router.post("/login", adminControllers.adminLogin)
router.get('/logout',verifyAdmin,adminControllers.adminLogout)
router.get('/refreshToken',adminControllers.refreshAccessToken)
router.post('/upload-admin-profile',verifyAdmin,upload.single('userProfile'),adminControllers.updateProfilePath)
router.post('/get-students',verifyAdmin,adminControllers.giveStudents)
router.get('/view-students',verifyAdmin,adminControllers.adminViewStudentsPage)
router.get('/student-dashboard/:studentName',verifyAdmin,adminControllers.adminViewStudentDashboard)
router.get('/student/student-attendence',verifyAdmin,adminControllers.viewAttendence)
router.get('/student/student-testscores',verifyAdmin,adminControllers.viewTestScores)
router.get('/view-teachers',verifyAdmin,adminControllers.giveTeachersPage)
router.get('/get-teachers',verifyAdmin,adminControllers.viewTeachers)
module.exports=router;