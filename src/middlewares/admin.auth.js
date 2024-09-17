const jwt=require('jsonwebtoken')
const Admin=require('../models/admin')
const verifyAdmin= async (req,res,next)=>{
const token=req.cookies?.accessToken
try {
    if(!token){
        return res.status(401).redirect('/admin-login')
    }
    const verifiedToken= jwt.verify(token,'mynameisdev')
    const admin= await Admin.findById(verifiedToken?._id).select('-password -refreshToken')
    if(!admin){
        return res.status(400).send('Invalid Token!')
    }
    req.user=admin
    next();
} catch (error) {
    if(error.name==='TokenExpiredError'){
        const destUrl=req.originalUrl
     
        return res.redirect(`/admin/refreshtoken?destUrl=${destUrl}`)
    }
    return  res.status(400).send('Internal Server Error')
    
}
}
module.exports={verifyAdmin}