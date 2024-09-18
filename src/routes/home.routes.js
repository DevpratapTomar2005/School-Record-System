const jwt=require('jsonwebtoken')
const express=require('express')
const router=express.Router()
const homeControllers=require('../controllers/home.controllers.js')
router.get('/',(req,res)=>{
    const token=req.cookies?.accessToken
    if(!token){
     return   res.status(401).redirect('/student-login')
    }
   try {
     const verifiedToken= jwt.verify(token,'mynameisdev')
 
     if(verifiedToken.role==='Teacher'){
        return res.status(201).redirect('/teacher/')
     }
    else if(verifiedToken.role==='Admin'){
        return res.status(201).redirect('/admin/')
     }
    else{
        return res.status(201).redirect('/student/')
     }
   } catch (error) {
    console.log(error)
    if(error.name==='TokenExpiredError'){
        
        return res.redirect(`/refreshtoken`)
    }
   return  res.status(400).send('Internal Server Error')
   }

})
router.get('/refreshtoken',homeControllers.refreshAccessToken)
module.exports=router;