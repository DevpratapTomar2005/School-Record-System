


const Student = require('../models/student.js');



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
            res.send("password and confirm password doesn't match")
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
        const studentData = await Student.findOne({ rollnum: rollnum, class: studentClass})
        if(!studentData){
            return res.redirect('/student-register')
        }
        
        if(password===studentData.password){

            res.render('student_index', {studentData})
        }
        else{
            res.send('Invalid Credentials')
        }
   
    } catch (error) {
        console.error(error)
        res.status(400).send(`Error:${error} `)
    }
};

module.exports={
    studentRegister,
    studentLogin
}