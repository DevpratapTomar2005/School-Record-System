

const  Admin = require('../models/admin.js')

const adminRegister= async (req,res)=>{
    
    try {
        const schoolEmail = req.body.schoolemail;
        const phonenumber = req.body.phonenumber;
        const schoolname = req.body.schoolname;

        const password = req.body.password;
        const confirmPassword = req.body.confirmpassword;
        if (password === confirmPassword) {
            const adminRegister = new Admin({

                emailid: schoolEmail,
                contactnum: phonenumber,
                schoolname: schoolname.toLowerCase(),
                password: password

            })
            let adminData = await adminRegister.save()
            res.render('admin_index', { adminData })
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

        let adminData = await Admin.findOne({ schoolname: schoolName.toLowerCase(), emailid: schoolEmail })
        if (password === adminData.password) {
            res.render('admin_index', { adminData })
        }
        else {
            res.send('Invalid Credentials')
        }
    } catch (error) {
        res.status(400).send(`Error occured:${error} `)
    }
}


module.exports={
    adminRegister,
    adminLogin
}