const jwt=require('jsonwebtoken');
const Student=require('../models/student.js');

const verifyStudent= async (req,res,next)=>{
    const token=req.cookies?.accessToken;
   
    if(!token){
        return res.status(401).redirect('/student-login')
     }
 try {
       const verifiedToken= jwt.verify(token,'mynameisdev')
       
      
       const student= await Student.findById(verifiedToken?._id).select('-password -refreshToken')
       if(!student){
          return res.status(401).send("Invalid Token!!")
       }
       req.user=student;
       next();
 } catch (error) {
    
    if(error.name==='TokenExpiredError'){
        return res.redirect('/student/refreshtoken')
    }
   return  res.status(400).send('Internal Server Error')
    
 }
}


module.exports={verifyStudent};