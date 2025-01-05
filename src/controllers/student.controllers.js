const Student = require("../models/student.js");

const {
  generateStudentRefreshToken,
  generateStudentAccessToken,
} = require("../utils/generateStudentTokens.js");
const jwt = require("jsonwebtoken");
const bcrypt=require('bcryptjs')

const {sortAttendenceAccordingToMonth}=require('../utils/sortingAttendenceMonth.js')
const generateAccessAndRefreshToken = async (studentId) => {
  try {
    const student = await Student.findById(studentId);

    const accessToken = generateStudentAccessToken(student);
    const refreshToken = generateStudentRefreshToken(student);

    student.refreshToken = refreshToken;
    await student.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Some thing went wrong while generating tokens");
  }
};

const studentRegister = async (req, res) => {
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
    const imagePath = "/images/userimg.png";
    
    if (password === confirmPassword) {
      const studentExists = await Student.findOne({
        rollnum,
        schoolname: schoolname.toLowerCase(),
        class: studentClass,
      });
      if (!studentExists) {
        const hashPassword=await bcrypt.hash(password,10)
        const studentData = await Student.create({
          firstname: firstname.toLowerCase(),
          lastname: lastname.toLowerCase(),
          rollnum,
          contactnum: phonenumber,
          schoolname: schoolname.toLowerCase(),
          gender,
          password:hashPassword,
          class: studentClass,
          imagepath: imagePath,
        });
        const { accessToken, refreshToken } =
          await generateAccessAndRefreshToken(studentData._id);

        const options = {
          httpOnly: true,
          secure: true,
        };
        return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .redirect("/student/");
      } else {
        return res.redirect("/student-login");
      }
    } else {
      return res.send("Invalid Credential!!");
    }
  } catch (error) {
    return res.send(`Error occured:${error} `);
  }
};

const studentLogin = async (req, res) => {
  try {
    const schoolname = req.body.schoolname;
    const studentClass = req.body.studentclass;
    const rollnum = req.body.rollnum;
    const password = req.body.password;
    
    const studentData = await Student.findOne({
      rollnum: rollnum,
      class: studentClass,
      schoolname: schoolname.toLowerCase(),
      
    });
    const decodedPassword=await bcrypt.compare(password,studentData.password)
    
    if (!studentData || !decodedPassword) {
      return res.send("Invalid Credentials!");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      studentData._id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .redirect("/student/");
  } catch (error) {
    console.error(error);
    res.status(400).send(`Error:${error} `);
  }
};
const studentIndex = async (req, res) => {
  try {
    const studentInfo = await Student.findById(req.user._id).select(
      "-password -refreshToken"
    );
    res.status(201).render("student_index", { studentInfo });
  } catch (error) {
    throw error;
  }
};

const studentDashboard = async (req, res) => {
  const student=req.user
  try {
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
    throw error;
  }
  
}

const studentLogout = async (req, res) => {
  try {
    await Student.findByIdAndUpdate(
      req.user._id,
      { $set: { refreshToken: undefined } },
      { new: true }
    ).select("-password");
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(201)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .redirect("/student-login");
  } catch (error) {
    throw error;
  }
};

const refreshAccessToken = async (req, res) => {
  const oldRefreshToken = req.cookies?.refreshToken;
  const destUrl = req.query.destUrl;

  try {
    if (!oldRefreshToken) {
      res.status(401).redirect("/student-login");
    }

    const verifiedOldToken = jwt.verify(oldRefreshToken, "mynameisdev");
    const studentRefresh = await Student.findById(verifiedOldToken?._id);

    if (!studentRefresh) {
      res.status(401).send("Invalid Refresh Token!");
    }

    if (oldRefreshToken !== studentRefresh?.refreshToken) {
      res.status(404).redirect("/student-login");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      studentRefresh._id
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .redirect(`${destUrl}`);
  } catch (error) {
    res.status(400).send(error);
  }
};
const updateProfilePath = async (req, res) => {
  try {
    
    const imagePath=req.file.path
    const newImagePath=imagePath.replace('public','')
    await Student.findByIdAndUpdate(
      req.user._id,
      { $set: { imagepath: newImagePath } },
      { new: true }
    ).select("-password -refreshToken");
    return res.status(201).redirect("/student/");
  } catch (error) {
    throw new Error("Failed to upload profile!!");
  }
};

const viewTestScore = async (req, res) => {
  const student = req.user;
try {
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
  
    return res.status(201).json({totalMarksUnitOne,totalMarksUnitTwo,totalMarksUnitThree,totalMarksUnitFour,totalMarksTermOne,totalMarksTermTwo})
} catch (error) {
  throw error;
}
};
const removeHomework = async (req, res) => {
  const { subject, date, homeworkDesc } = req.body;
  const student = req.user;

  try {
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.homeworks = student.homeworks.filter(homework => {
      return !(homework.subject === subject && homework.date === date && homework.task === homeworkDesc);
    });

    await student.save({ validateBeforeSave: false });

    return res.status(201);
  } catch (error) {
    throw error;
  }
};
module.exports = {
  studentRegister,
  studentLogin,
  studentIndex,
  studentLogout,
  refreshAccessToken,
  updateProfilePath,
  studentDashboard,
  viewTestScore,
  removeHomework
};
