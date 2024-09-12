const express = require('express')

const router=express.Router()
const adminControllers=require('../controllers/admin.controllers.js')

router.post("/admin-register", adminControllers.adminRegister)
router.post("/admin-login", adminControllers.adminLogin)
module.exports=router;