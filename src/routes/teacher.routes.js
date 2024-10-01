const express = require("express");

const router = express.Router();
const teacherControllers = require("../controllers/teacher.controllers.js");
const { verifyTeacher } = require("../middlewares/teacher.auth.js");
const {upload} = require("../middlewares/multer.uploadpfp.js");

router.get("/", verifyTeacher, teacherControllers.teacherIndex);
router.post("/register", teacherControllers.teacherRegister);
router.post("/login", teacherControllers.teacherLogin);
router.get("/logout", verifyTeacher, teacherControllers.teacherLogout);
router.get("/refreshToken", teacherControllers.refreshAccessToken);
router.post(
  "/upload-teacher-profile",
  verifyTeacher,
  upload.single('userProfile'),
  teacherControllers.updateProfilePath
);
router.get('/mark-attendence', verifyTeacher, teacherControllers.markAttendencePage)
router.post('/mark-attendence', verifyTeacher, teacherControllers.markAttendence)
module.exports = router;
