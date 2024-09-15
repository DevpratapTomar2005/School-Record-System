const jwt=require('jsonwebtoken');
const Student=require('../models/student.js');

const verifyStudent= async (req,res,next)=>{
    const token=req.cookies?.accessToken;
   
 try {
      if(!token){
           res.status(401).redirect('/student-login')
       }
       const verifiedToken= jwt.verify(token,'mynameisdev')
       
      
       const student= await Student.findById(verifiedToken?._id).select('-password -refreshToken')
       if(!student){
           res.status(401).send("Invalid Token!!")
       }
       req.user=student;
       next();
 } catch (error) {
    console.log(error)
    
 }
}


module.exports={verifyStudent};