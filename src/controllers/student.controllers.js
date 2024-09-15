
const Student = require('../models/student.js');
const {generateAccessToken,generateRefreshToken}=require('../utils/generateTokens.js')
const generateAccessAndRefreshToken= async (studentId)=>{
  try {
     const student= await Student.findById(studentId)
     const accessToken= generateAccessToken(student);
     const refreshToken=  generateRefreshToken(student);
     
     student.refreshToken=refreshToken;
      await student.save({validateBeforeSave:false});
      return {accessToken,refreshToken};
  } catch (error) {
    res.status(400).send('Some thing went wrong while generating tokens')
  }

}

const studentRegister= async (req,res)=>{
    try {
       
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const rollnum = req.body.rollnum;
        const phonenumber = req.body.phonenumber;
        const schoolname = req.body.schoolname;
        const gender = req.body.gender;
        const password = req.body.password;
        const confirmPassword = req.body.confirmpassword;
        const studentClass = req.body.studentclass;
        if(password===confirmPassword){

            const studentExists= await Student.findOne({rollnum,schoolname:schoolname.toLowerCase(),class:studentClass});
            if(!studentExists){
             const studentData= await Student.create({
                firstname:firstname.toLowerCase(),
                lastname:lastname.toLowerCase(),
                rollnum,
                contactnum:phonenumber,
                schoolname:schoolname.toLowerCase(),
                gender,
                password,
                class:studentClass
             });
             res.render('student_index',{studentData});
            }
            else{
                res.redirect('/student-login');
            }
        }
        else{
            res.send("Invalid Credential!!")
        }

         

    } catch (error) {
        res.send(`Error occured:${error} `)
    }
};




const studentLogin= async (req,res)=>{
    try {

        const studentClass = req.body.studentclass
        const rollnum = req.body.rollnum
        const password = req.body.password
        const studentData = await Student.findOne({ rollnum: rollnum, class: studentClass, password})
        
        if(!studentData){
            res.send('Invalid Credentials')
        }
        const {accessToken,refreshToken}=await generateAccessAndRefreshToken(studentData._id)
        
        const options={
            httpOnly:true,
            secure:true
        }
        res.status(200).cookie("accessToken",accessToken,options).cookie('refreshToken',refreshToken,options).redirect('/');
     
    } catch (error) {
        console.error(error)
        res.status(400).send(`Error:${error} `)
    }

};
const studentIndex=async (req,res)=>{
    try {
        
        const studentInfo= await Student.findById(req.user._id).select('-password -refreshToken');
        res.status(201).render('student_index',{studentInfo})

    } catch (error) {
        throw error;
    }

}

const studentLogout= async (req,res)=>{
    try {
      
        await Student.findByIdAndUpdate(req.user._id,{$set:{refreshToken:undefined}},{new:true}).select('-password')
        const options={
            httpOnly:true,
            secure:true
        }
      return  res.status(201).clearCookie("accessToken",options).clearCookie("refreshToken",options).redirect('/student-login')
    } catch (error) {
        throw error;
    }
}
module.exports={
    studentRegister,
    studentLogin,
    studentIndex,
    studentLogout
}