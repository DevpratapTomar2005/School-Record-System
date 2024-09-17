const jwt=require('jsonwebtoken')
const Teacher=require('../models/teacher')
const verifyTeacher= async (req,res,next)=>{
const token=req.cookies?.accessToken
try {
    if(!token){
        return res.status(401).redirect('/teacher-login')
    }
    const verifiedToken= jwt.verify(token,'mynameisdev')
    const teacher= await Teacher.findById(verifiedToken?._id).select('-password -refreshToken')
    if(!teacher){
        return res.status(400).send('Invalid Token!')
    }
    req.user=teacher
    next();
} catch (error) {
    if(error.name==='TokenExpiredError'){
        const destUrl=req.originalUrl
     
        return res.redirect(`/teacher/refreshtoken?destUrl=${destUrl}`)
    }
    return  res.status(400).send('Internal Server Error')
    
}
}
module.exports={verifyTeacher}