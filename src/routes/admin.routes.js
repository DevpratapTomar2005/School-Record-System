const express = require('express')

const router=express.Router()
const adminControllers=require('../controllers/admin.controllers.js')

router.post("/register", adminControllers.adminRegister)
router.post("/login", adminControllers.adminLogin)
module.exports=router;