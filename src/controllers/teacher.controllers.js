const Teacher = require("../models/teacher.js");
const Student = require("../models/student.js");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt=require('bcryptjs')
const {
  generateTeacherAccessToken,
  generateTeacherRefreshToken,
} = require("../utils/generateTeacherTokens.js");
const {sortAttendenceAccordingToMonth}=require('../utils/sortingAttendenceMonth.js')

const generateAccessAndRefreshTokens = async (user) => {
  try {
    const accessToken = generateTeacherAccessToken(user);
    const refreshToken = generateTeacherRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Some thing went wrong while generating tokens");
  }
};
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
  const imagePath = "/images/userimg.png";

  try {
    if (password === confirmPassword) {
      const teacherExists = await Teacher.findOne({
        firstname,
        lastname,
        emailid: teacherEmail,
        schoolname,
        subject: teacherSubject,
      });
      if (!teacherExists) {
         const hashPassword=await bcrypt.hash(password,10)
        const teacherData = await Teacher.create({
          firstname: firstname.toLowerCase(),
          lastname: lastname.toLowerCase(),
          emailid: teacherEmail,
          contactnum: phonenumber,
          schoolname: schoolname.toLowerCase(),
          gender: gender,
          password: hashPassword,
          subject: teacherSubject.toLowerCase(),
          imagepath: imagePath,
        });

        const { accessToken, refreshToken } =
          await generateAccessAndRefreshTokens(teacherData);

        const options = {
          httpOnly: true,
          secure: true,
        };
        return res
          .status(200)
          .cookie("accessToken", accessToken, options)
          .cookie("refreshToken", refreshToken, options)
          .redirect("/teacher/");
      } else {
        return res.redirect("/teacher-login");
      }
    } else {
      res.send("Ivalid Credentials");
    }
  } catch (error) {
    res.send(`Error occured:${error} `);
  }
};

const teacherLogin = async (req, res) => {
  try {
    const teacherName = req.body.teachername;
    const schoolname = req.body.schoolname;
    const teacherEmail = req.body.teacheremail;
    const password = req.body.password;
    const teacherFullname = teacherName.split(" ");
    const teacherData = await Teacher.findOne({
      firstname: teacherFullname[0].toLowerCase(),
      lastname: teacherFullname[teacherFullname.length - 1].toLowerCase(),
      emailid: teacherEmail,
      schoolname: schoolname.toLowerCase(),
    });
    const decodedPassword=await bcrypt.compare(password,teacherData.password)
    if (teacherData && decodedPassword) {
      const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(teacherData);
      res
        .status(200)
        .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
        .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
        .redirect("/teacher/");
    } else {
      res.send("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send(`Error occured:${error} `);
  }
};

const teacherIndex = async (req, res) => {
  try {
    const teacherInfo = await Teacher.findById(req.user._id).select(
      "-password -refreshToken"
    );
    res.status(201).render("teacher_index", { teacherInfo });
  } catch (error) {
    throw error;
  }
};
const teacherLogout = async (req, res) => {
  try {
    await Teacher.findByIdAndUpdate(
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
      .redirect("/teacher-login");
  } catch (error) {
    throw error;
  }
};
const refreshAccessToken = async (req, res) => {
  const oldRefreshToken = req.cookies?.refreshToken;
  const destUrl = req.query.destUrl;

  try {
    if (!oldRefreshToken) {
      res.status(401).redirect("/teacher-login");
    }

    const verifiedOldToken = jwt.verify(oldRefreshToken, "mynameisdev");
    const teacherRefresh = await Teacher.findById(verifiedOldToken?._id);

    if (!teacherRefresh) {
      res.status(401).send("Invalid Refresh Token!");
    }

    if (oldRefreshToken !== teacherRefresh?.refreshToken) {
      res.status(404).redirect("/teacher-login");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      teacherRefresh
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
    const imagePath = req.file.path;
    const newImagePath = imagePath.replace("public", "");
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
const markAttendencePage = (req, res) => {
  res
    .status(201)
    .sendFile(
      path.join(__dirname, "../../public/templates", "mark_attendence.html")
    );
};

const giveHomeworkPage = (req, res) => {
  res
    .status(201)
    .sendFile(
      path.join(__dirname, "../../public/templates", "give_homework.html")
    );
};
const uploadHomework = async (req, res) => {
  const homeworkData = req.body;

  const classStudents = await Student.find({
    class: homeworkData.studentClass,
    schoolname: req.user.schoolname,
  }).select(
    "-password -refreshToken -gender -contactnum -imagepath -absentdays -presentdays -lastmarked"
  );
  const date = new Date().toLocaleDateString("en-IN");
  classStudents.forEach(async (e) => {
    e.homeworks.push({
      subject: req.user.subject,
      teachername: req.user.firstname + " " + req.user.lastname,
      date: date,
      task: homeworkData.homework,
    });
    await e.save({ validateBeforeSave: false });
  });

  res.status(201).json({ subject: req.user.subject, date: date });
};
const giveTestscorePage = (req, res) => {
  res
    .status(201)
    .sendFile(
      path.join(__dirname, "../../public/templates", "give_testscores.html")
    );
};
const giveStudents = async (req, res) => {
  const studentData = req.body;
  
  const students = await Student.find({
    class: studentData.studentClass,
    schoolname: req.user.schoolname,
  }).select("-password -refreshToken");

  res.status(201).json({ subject: req.user.subject, students });
};

markTestscores = async (req, res) => {
  const marksData = req.body.data;

  try {
    const students = await Student.find({
      class: marksData[0].studentClass,
      schoolname: req.user.schoolname,
    }).select("-password -refreshToken -homeworks -imagepath -contactnum");
    if (!students) {
      throw new Error("No students found!!");
    }

    for (const student of students) {
      const testscores = marksData
        .filter((marks) => student.rollnum == marks.rollnum)
        .map((marks) => {
          return {
            subject: marks.subject,
            examName: marks.examName,
            maxMarks: marks.maxMarks,
            obtainedMarks: marks.obtainedMarks,
            markedDate: marks.markedDate,
          };
        });

      student.testscore.push(...testscores);

      await student.save({ validateBeforeSave: false });
    }

    return res
      .status(200)
      .json({ message: "Test Scores Saved SuccessFully!!" });
  } catch (error) {
    throw error;
  }
};

const markAttendence = async (req, res) => {
  const attendenceData = req.body.attendenceData;

  try {
    const students = await Student.find({
      class: attendenceData[0].studentClass,
      schoolname: req.user.schoolname,
    }).select("-password -refreshToken -homeworks -imagepath -contactnum");
    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No students found!!" });
    }

    for (const student of students) {
      if (student.lastAttendenceMarked === new Date().toLocaleDateString("en-IN")) {
        return res.status(400).json({ message: "Attendence already marked for today!!" });
      }
    }
    for (const student of students) {
      const attendences = attendenceData
        .filter((attendence) => student.rollnum == attendence.rollnum)
        .map((attendence) => {
          return {
            firstname: attendence.firstname,
            lastname: attendence.lastname,
            rollnumber: attendence.rollnum,
            studentClass: attendence.studentClass,
            studentAttendence: attendence.studentAttendence,
            attendenceDate: attendence.date,
          };
        });

      student.attendence.push(...attendences);
      student.lastAttendenceMarked = new Date().toLocaleDateString("en-IN");

      await student.save({ validateBeforeSave: false });
    }

    return res
      .status(200)
      .json({ message: "Attendence Marked SuccessFully!!" });
  } catch (error) {
    throw error;
  }
};
const viewAttendencePage = (req, res) => {
  res
    .status(201)
    .sendFile(
      path.join(__dirname, "../../public/templates", "view_attendence.html")
    );
};

const getAttendence = async (req, res) => {
  const studentInfo = req.body.studentInfo;

 try {
   const student = await Student.findOne({
     class: studentInfo.studentClass,
     rollnum: studentInfo.studentRollNum,
     schoolname: req.user.schoolname,
   }).select(
     "-password -refreshToken -homeworks  -testscore"
   );
   
 
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
 
 return res.status(201).json({attendenceMonths,attendenceMonthsPercentage,attendenceThisYear,currentYear,student})
 } catch (error) {
  throw error
 }

};
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
  giveTestscorePage,
  markTestscores,
  viewAttendencePage,
  getAttendence,
};
