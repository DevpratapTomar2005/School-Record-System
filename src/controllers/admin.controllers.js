

const  Admin = require('../models/admin.js')
const Student=require('../models/student.js')
const Teacher=require('../models/teacher.js')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const { generateAdminAccessToken, generateAdminRefreshToken } = require('../utils/generateAdminTokens.js')
const path=require('path')
const {sortAttendenceAccordingToMonth}=require('../utils/sortingAttendenceMonth.js')

const generateAccessAndRefreshTokens = async (user) => {
    try {
        const accessToken = generateAdminAccessToken(user)
        const refreshToken = generateAdminRefreshToken(user)
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
       
        return { accessToken, refreshToken }
    } catch (error) {
        res.status(500).send('Error in generating tokens')
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
                const hashPassword=await bcrypt.hash(password,10)
                const adminData = await Admin.create({
    
                    emailid: schoolEmail,
                    contactnum: phonenumber,
                    schoolname: schoolname.toLowerCase(),
                    password: hashPassword,
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
      return res.status(500).send('Internal Server Error')
    }
}

const adminLogin= async (req,res)=>{
    
    try {

        const schoolName = req.body.schoolname
        const schoolEmail = req.body.schoolemail
        const password = req.body.password
      

        const adminData = await Admin.findOne({ schoolname: schoolName.toLowerCase(), emailid: schoolEmail })
        const decodedPassword = await bcrypt.compare(password, adminData.password)
        if (adminData && decodedPassword) {
            const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(adminData)
            res.status(200).cookie('accessToken', accessToken, { httpOnly: true, secure: true }).cookie('refreshToken', refreshToken, { httpOnly: true, secure: true }).redirect('/admin/')
        }
        else {
            res.send('Invalid Credentials')
        }
    } catch (error) {
      return res.status(500).send('Internal Server Error')
    }
}
const adminIndex= async (req,res)=>{
    try {
      const adminInfo= await Admin.findById(req.user._id).select('-password -refreshToken')
      res.status(201).render('admin_index', { adminInfo })
      
    } catch (error) {
      return res.status(500).send('Internal Server Error')
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
        return res.status(500).send('Internal Server Error')
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
          
        
        return  res.status(200).cookie('accessToken', accessToken, options).cookie('refreshToken', refreshToken, options).redirect(`${destUrl}`)
      } catch (error) {
        return res.status(500).send('Internal Server Error')
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
      return res.status(500).send('Internal Server Error')
    }
  };

  const adminViewStudentsPage=  (req,res)=>{
    return res.sendFile(path.join(__dirname, '../../public/templates', 'view_students.html'))
  }
  const giveStudents = async (req, res) => {
    const studentData = req.body;
 
   try {
     const students = await Student.find({
       class: studentData.studentClass,
       schoolname: req.user.schoolname,
     }).select("-password -refreshToken");
     if (!students) {
       return res.status(404).send("No Students Found");
     }
     res.status(201).json({ students });
   } catch (error) {
    return res.status(500).send('Internal Server Error')
   }
  };

  const adminViewStudentDashboard= async (req,res)=>{
    const studentName=req.params.studentName
    const studentData=studentName.split('-')
  try {
      const student=await Student.findOne({rollnum:studentData[1],class:studentData[2],schoolname:req.user.schoolname}).select('-password -refreshToken')
      if(!student){
        return  res.status(404).send('Student not found')
      }   
     const studentDetails={
        rollnum:studentData[1],class:studentData[2]
     }
      return res.status(201).cookie('currentStudent',studentDetails,{httpOnly:true}).render('admin_student_dashboard',{student})
  } catch (error) {
    return res.status(500).send('Internal Server Error')
  }
  }
  const viewAttendence=async (req,res)=>{
    const studentData= req.cookies?.currentStudent
    
  
 try {
        const student=await Student.findOne({rollnum:studentData.rollnum,class:studentData.class,schoolname:req.user.schoolname}).select('-password -refreshToken')
     if(!student){
         return  res.status(404).send('Student not found')
     }
       const {attendenceMonths,attendenceMonthsPercentage}=sortAttendenceAccordingToMonth(student)
      
      
       const currentYear=new Date().getFullYear();
       
       let yearPresentDays=0;
       let yearAbsentDays=0;
       
       student.attendence.forEach(e=>{
         let dateParts = e.attendenceDate.split('/');  
         let year = dateParts[2]
         if(year==currentYear){
           if(e.studentAttendence==='Present'){
             yearPresentDays= yearPresentDays+1;
           }
           if(e.studentAttendence==='Absent'){
             yearAbsentDays=yearAbsentDays+1;
           }
         }
       })
       
       const attendenceThisYear=(yearPresentDays/(yearPresentDays+yearAbsentDays))*100
       
       return res.status(201).json({attendenceMonths,attendenceMonthsPercentage,attendenceThisYear,student})
 } catch (error) {
  return res.status(500).send('Internal Server Error')
    
 }
  }
 const viewTestScores=async (req,res)=>{
    const student= req.cookies?.currentStudent
  
   try {
     const student=await Student.findOne({rollnum:studentData[1],class:studentData[2],schoolname:req.user.schoolname}).select('-password -refreshToken')
     if(!student){
       return  res.status(404).send('Student not found')
     }
     let maxUnitMarksOne=0;
     let obtainedMarksOne=0;
     let maxUnitMarksTwo=0;
     let obtainedMarksTwo=0;
     let maxUnitMarksThree=0;
     let obtainedMarksThree=0;
     let maxUnitMarksFour=0;
     let obtainedMarksFour=0;
     let maxUnitMarksTermOne=0;
     let obtainedMarksTermOne=0;
     let maxUnitMarksTermTwo=0;
     let obtainedMarksTermTwo=0;
   
     student.testscore.forEach(e=>{
       if(e.examName==='Unit Test-1'){
         maxUnitMarksOne+=e.maxMarks
         obtainedMarksOne+=e.obtainedMarks
       }
       if(e.examName==='Unit Test-2'){
         maxUnitMarksTwo+=e.maxMarks
         obtainedMarksTwo+=e.obtainedMarks
       }
       if(e.examName==='Unit Test-3'){
         maxUnitMarksThree+=e.maxMarks
         obtainedMarksThree+=e.obtainedMarks
       }
       if(e.examName==='Unit Test-4'){
         maxUnitMarksFour+=e.maxMarks
         obtainedMarksFour+=e.obtainedMarks
       }
       if(e.examName==='Term-1'){
         maxUnitMarksTermOne+=e.maxMarks
         obtainedMarksTermOne+=e.obtainedMarks
       }
       if(e.examName==='Term-2'){
         maxUnitMarksTermTwo+=e.maxMarks
         obtainedMarksTermTwo+=e.obtainedMarks
       }
     })
   
     const totalMarksUnitOne=(obtainedMarksOne/maxUnitMarksOne)*100 
     const totalMarksUnitTwo=(obtainedMarksTwo/maxUnitMarksTwo)*100
     const totalMarksUnitThree=(obtainedMarksThree/maxUnitMarksThree)*100
     const totalMarksUnitFour=(obtainedMarksFour/maxUnitMarksFour)*100
     const totalMarksTermOne=(obtainedMarksTermOne/maxUnitMarksTermOne)*100
     const totalMarksTermTwo=(obtainedMarksTermTwo/maxUnitMarksTermTwo)*100
   
     return res.status(201).clearCookie('currentStudent',{httpOnly:true}).json({totalMarksUnitOne,totalMarksUnitTwo,totalMarksUnitThree,totalMarksUnitFour,totalMarksTermOne,totalMarksTermTwo})
   } catch (error) {
    
    return res.status(500).send('Internal Server Error')
   }
 }
 const giveTeachersPage= (req,res)=>{
    return res.sendFile(path.join(__dirname, '../../public/templates', 'view_teachers.html'))
 }
 const viewTeachers=async (req,res)=>{
    try {
        const teachers=await Teacher.find({schoolname:req.user.schoolname}).select('-password -refreshToken')
        if(!teachers){
            return res.status(404).send('No Teachers Found')
        }
        return res.status(201).json({teachers})
    } catch (error) {
       return res.status(500).send('Internal Server Error')
    }
   
}
module.exports={
    adminRegister,
    adminLogin,
    adminLogout,
    adminIndex,
    refreshAccessToken,
    updateProfilePath,
    adminViewStudentsPage,
    giveStudents,
    adminViewStudentDashboard,
    viewAttendence,
    viewTestScores,
    viewTeachers,
    giveTeachersPage
}