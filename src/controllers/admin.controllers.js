

const  Admin = require('../models/admin.js')
const jwt=require('jsonwebtoken')
const { generateAdminAccessToken, generateAdminRefreshToken } = require('../utils/generateAdminTokens.js')
const generateAccessAndRefreshTokens = async (user) => {
    try {
        const accessToken = generateAdminAccessToken(user)
        const refreshToken = generateAdminRefreshToken(user)
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
       
        return { accessToken, refreshToken }
    } catch (error) {
        throw new Error("Some thing went wrong while generating tokens");
    }
}

const adminRegister= async (req,res)=>{
    
    try {
        const schoolEmail = req.body.schoolemail;
        const phonenumber = req.body.phonenumber;
        const schoolname = req.body.schoolname;
        const imagePath="/images/userimg.png";
        const password = req.body.password;
        const confirmPassword = req.body.confirmpassword;
        if (password === confirmPassword) {
            const adminExists= await Admin.findOne({schoolname: schoolname.toLowerCase(), emailid: schoolEmail})
            if(!adminExists){

                const adminData = await Admin.create({
    
                    emailid: schoolEmail,
                    contactnum: phonenumber,
                    schoolname: schoolname.toLowerCase(),
                    password: password,
                    imagepath:imagePath
                })
                const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(adminData)

                const options = {
                    httpOnly: true,
                    secure: true
                }
                return res.status(200).cookie("accessToken", accessToken, options).cookie('refreshToken', refreshToken, options).redirect('/admin/');
            }
            else{
                res.redirect('/admin-login')
            }
           
        }
        else {
            res.send("Ivalid Credentials")
        }

    } catch (error) {
        res.status(400).send(`Error occured:${error} `)
    }
}

const adminLogin= async (req,res)=>{
    
    try {

        const schoolName = req.body.schoolname
        const schoolEmail = req.body.schoolemail
        const password = req.body.password

        const adminData = await Admin.findOne({ schoolname: schoolName.toLowerCase(), emailid: schoolEmail })
        if (password === adminData.password) {
            const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(adminData)
            res.status(200).cookie('accessToken', accessToken, { httpOnly: true, secure: true }).cookie('refreshToken', refreshToken, { httpOnly: true, secure: true }).redirect('/admin/')
        }
        else {
            res.send('Invalid Credentials')
        }
    } catch (error) {
        res.status(400).send(`Error occured:${error} `)
    }
}
const adminIndex= async (req,res)=>{
    try {
      const adminInfo= await Admin.findById(req.user._id).select('-password -refreshToken')
      res.status(201).render('admin_index', { adminInfo })
      
    } catch (error) {
      throw error;
    }
  }
  const adminLogout = async (req, res) => {
      try {
  
          await Admin.findByIdAndUpdate(req.user._id, { $set: { refreshToken: undefined } }, { new: true }).select('-password')
          const options = {
              httpOnly: true,
              secure: true
          }
          return res.status(201).clearCookie("accessToken", options).clearCookie("refreshToken", options).redirect('/admin-login')
      } catch (error) {
          throw error;
      }
  }
  const refreshAccessToken = async (req, res) => {
      const oldRefreshToken = req.cookies?.refreshToken
  const destUrl=req.query.destUrl
  
      try {
          if (!oldRefreshToken) {
              res.status(401).redirect('/admin-login')
          }
  
          const verifiedOldToken = jwt.verify(oldRefreshToken, 'mynameisdev')
          const adminRefresh = await Admin.findById(verifiedOldToken?._id)
  
          if (!adminRefresh) {
              res.status(401).send('Invalid Refresh Token!')
          }
  
          if (oldRefreshToken !== adminRefresh?.refreshToken) {
              res.status(404).redirect('/admin-login')
          }
          const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(adminRefresh)
  
          const options = {
              httpOnly: true,
              secure: true
          }
          
        
          res.status(200).cookie('accessToken', accessToken, options).cookie('refreshToken', refreshToken, options).redirect(`${destUrl}`)
      } catch (error) {
          res.status(400).send(error)
      }
  
  }
  const updateProfilePath = async (req, res) => {
    try {
      
      const imagePath=req.file.path
      const newImagePath=imagePath.replace('public','')
      await Admin.findByIdAndUpdate(
        req.user._id,
        { $set: { imagepath: newImagePath } },
        { new: true }
      ).select("-password -refreshToken");
      return res.status(201).redirect("/admin/");
    } catch (error) {
      throw new Error("Failed to upload profile!!");
    }
  };
module.exports={
    adminRegister,
    adminLogin,
    adminLogout,
    adminIndex,
    refreshAccessToken,
    updateProfilePath
}