


const Student = require('../models/student.js');



const studentRegister= async (req,res)=>{
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const rollnum = req.body.rollnum;
    const phonenumber = req.body.phonenumber;
    const schoolname = req.body.schoolname;
    const gender = req.body.gender;
    const password = req.body.password;
    const confirmPassword = req.body.confirmpassword;
    const studentClass = req.body.studentclass;
    try {
        if (password === confirmPassword) {
            const studentRegister = new Student({
                firstname: firstname.toLowerCase(),
                lastname: lastname.toLowerCase(),
                rollnum: rollnum,
                contactnum: phonenumber,
                schoolname: schoolname.toLowerCase(),
                gender: gender,
                password: password,
                class: studentClass
            })
            let studentData= await studentRegister.save();

          
            res.render('student_index',{
                studentData
            })
          
        }
        else {
            res.send("Ivalid Credentials")
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
        const studentData = await Student.findOne({ rollnum: rollnum, class: studentClass })
        
        if (password === studentData.password) {

            res.render('student_index', {
                studentData
            })

        }
        else {
            res.send('Invalid Credentials')
        }
    } catch (error) {
        console.error(error)
        res.status(400).send(`Error occured:${error} `)
    }
};

module.exports={
    studentRegister,
    studentLogin
}