

const Teacher = require('../models/teacher.js')
const Student = require('../models/student.js')
const path=require('path')
const jwt=require('jsonwebtoken')
const { generateTeacherAccessToken, generateTeacherRefreshToken } = require('../utils/generateTeacherTokens.js')
const generateAccessAndRefreshTokens = async (user) => {
    try {
        const accessToken = generateTeacherAccessToken(user)
        const refreshToken = generateTeacherRefreshToken(user)
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
       
        return { accessToken, refreshToken }
    } catch (error) {
        throw new Error("Some thing went wrong while generating tokens");
    }
}
const teacherRegister = async (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const teacherEmail = req.body.teacheremail;
    const phonenumber = req.body.phonenumber;
    const schoolname = req.body.schoolname;
    const gender = req.body.gender;
    const password = req.body.password;
    const confirmPassword = req.body.confirmpassword;
    const teacherSubject = req.body.teachersubject;
     const imagePath="/images/userimg.png";
     
    try {
        if (password === confirmPassword) {
            const teacherExists = await Teacher.findOne({ firstname, lastname, emailid: teacherEmail, schoolname, subject: teacherSubject })
            if (!teacherExists) {

                const teacherData = await Teacher.create({
                    firstname: firstname.toLowerCase(),
                    lastname: lastname.toLowerCase(),
                    emailid: teacherEmail,
                    contactnum: phonenumber,
                    schoolname: schoolname.toLowerCase(),
                    gender: gender,
                    password: password,
                    subject: teacherSubject.toLowerCase(),
                    imagepath:imagePath
                });

                const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(teacherData)

                const options = {
                    httpOnly: true,
                    secure: true
                }
                return res.status(200).cookie("accessToken", accessToken, options).cookie('refreshToken', refreshToken, options).redirect('/teacher/');
            }
            else {
                return res.redirect('/teacher-login')
            }
        }
        else {
            res.send("Ivalid Credentials")
        }

    } catch (error) {
        res.send(`Error occured:${error} `)
    }
}


const teacherLogin = async (req, res) => {
    try {

        const teacherName = req.body.teachername
        const schoolname=req.body.schoolname
        const teacherEmail = req.body.teacheremail
        const password = req.body.password
        const teacherFullname = teacherName.split(' ')
        const teacherData = await Teacher.findOne({ firstname: teacherFullname[0].toLowerCase(), lastname: teacherFullname[teacherFullname.length - 1].toLowerCase(), emailid: teacherEmail ,schoolname:schoolname.toLowerCase()})
        if (password === teacherData.password) {
            const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(teacherData)
            res.status(200).cookie('accessToken', accessToken, { httpOnly: true, secure: true }).cookie('refreshToken', refreshToken, { httpOnly: true, secure: true }).redirect('/teacher/')
        }
        else {
            res.send('Invalid Credentials')
        }
    } catch (error) {
        res.status(400).send(`Error occured:${error} `)
    }
}

const teacherIndex= async (req,res)=>{
  try {
    const teacherInfo= await Teacher.findById(req.user._id).select('-password -refreshToken')
    res.status(201).render('teacher_index', { teacherInfo })
    
  } catch (error) {
    throw error;
  }
}
const teacherLogout = async (req, res) => {
    try {

        await Teacher.findByIdAndUpdate(req.user._id, { $set: { refreshToken: undefined } }, { new: true }).select('-password')
        const options = {
            httpOnly: true,
            secure: true
        }
        return res.status(201).clearCookie("accessToken", options).clearCookie("refreshToken", options).redirect('/teacher-login')
    } catch (error) {
        throw error;
    }
}
const refreshAccessToken = async (req, res) => {
    const oldRefreshToken = req.cookies?.refreshToken
const destUrl=req.query.destUrl

    try {
        if (!oldRefreshToken) {
            res.status(401).redirect('/teacher-login')
        }

        const verifiedOldToken = jwt.verify(oldRefreshToken, 'mynameisdev')
        const teacherRefresh = await Teacher.findById(verifiedOldToken?._id)

        if (!teacherRefresh) {
            res.status(401).send('Invalid Refresh Token!')
        }

        if (oldRefreshToken !== teacherRefresh?.refreshToken) {
            res.status(404).redirect('/teacher-login')
        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(teacherRefresh)

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
      await Teacher.findByIdAndUpdate(
        req.user._id,
        { $set: { imagepath: newImagePath } },
        { new: true }
      ).select("-password -refreshToken");
      return res.status(201).redirect("/teacher/");
    } catch (error) {
      throw new Error("Failed to upload profile!!");
    }
  };
  const markAttendencePage= (req,res)=>{
    res.status(201).sendFile(path.join(__dirname ,'../../public/templates', 'mark_attendence.html'));
  }

  const markAttendence= async (req,res)=>{
    
   const studentData=req.body
  
  try {
     const student=await Student.findOne({rollnum:studentData.studentRollNum,class: studentData.studentClass,schoolname:req.user.schoolname }).select('-password -refreshToken -testscores -imagepath -contactnum')
     if(!student){
      throw new Error('Student Not Found!!')
     }
     const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
     const currentDate = new Date().toLocaleDateString('en-IN', dateOptions).replace('-','/');
     
     if(currentDate!==student.lastmarked){
      if(studentData.attendenceStatus==='Absent'){
          student.absentdays=student.absentdays+1
      }
      else{
          student.presentdays=student.presentdays+1
      }
      student.lastmarked=currentDate
      const updatedStudent= await student.save({validateBeforeSave:false})
    
      return res.status(200).json(updatedStudent)
     }
     else{
      throw new Error("You can't mark attendence twice in a day!")
     }
  } catch (error) {
    throw error
  }
   
  }

const giveHomeworkPage= (req,res)=>{
    res.status(201).sendFile(path.join(__dirname ,'../../public/templates', 'give_homework.html'));
}
const uploadHomework= async (req,res)=>{
    const homeworkData=req.body
   
    const classStudents= await Student.find({class:homeworkData.studentClass, schoolname:req.user.schoolname}).select('-password -refreshToken -gender -contactnum -imagepath -absentdays -presentdays -lastmarked')
  const date= new Date().toLocaleDateString('en-IN')
    classStudents.forEach(async (e) => {
       e.homeworks.push({subject:req.user.subject, teachername:req.user.firstname+' '+req.user.lastname, date: date, task: homeworkData.homework})
       await e.save({validateBeforeSave:false})
    });
    
     res.status(201).json({subject: req.user.subject, date: date })
}
const giveTestscorePage= (req,res)=>{
    res.status(201).sendFile(path.join(__dirname ,'../../public/templates', 'give_testscores.html'));
}
const giveStudents= async (req,res)=>{
    
const studentData=req.body
const students=await Student.find({class:studentData.studentClass, schoolname:req.user.schoolname}).select('-password -refreshToken')

res.status(201).json({subject: req.user.subject, students })
}
module.exports = {
    teacherRegister,
    teacherLogin,
    teacherIndex,
    teacherLogout,
    refreshAccessToken,
    updateProfilePath,
    markAttendencePage,
    markAttendence,
    giveHomeworkPage,
    uploadHomework,
    giveStudents,
    giveTestscorePage
}