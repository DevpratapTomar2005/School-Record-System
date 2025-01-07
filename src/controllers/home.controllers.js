const Teacher = require('../models/teacher.js')
const Student = require('../models/student.js')
const Admin = require('../models/admin.js')
const jwt = require('jsonwebtoken')
const { generateTeacherAccessToken, generateTeacherRefreshToken } = require('../utils/generateTeacherTokens.js')
const { generateStudentAccessToken, generateStudentRefreshToken } = require('../utils/generateStudentTokens.js')
const { generateAdminAccessToken, generateAdminRefreshToken } = require('../utils/generateAdminTokens.js')
const options={
    httpOnly: true,
    secure: true
}
const refreshAccessToken = async (req, res) => {
    const oldRefreshToken = req.cookies?.refreshToken
    
    
    try {
        if (!oldRefreshToken) {
        return    res.status(401).redirect('/teacher-login')
        }

        const verifiedOldToken = jwt.verify(oldRefreshToken, 'mynameisdev')

        if (verifiedOldToken.role === 'Teacher') {
            const teacherRefresh = await Teacher.findById(verifiedOldToken?._id)

            if (!teacherRefresh) {
                res.status(401).send('Invalid Refresh Token!')
            }

            if (oldRefreshToken !== teacherRefresh?.refreshToken) {
                res.status(404).redirect('/teacher-login')
            }
            const accessToken = generateTeacherAccessToken(teacherRefresh)
            const refreshToken = generateTeacherRefreshToken(teacherRefresh)
            teacherRefresh.refreshToken = refreshToken;
            await teacherRefresh.save({ validateBeforeSave: false })
           return res.status(200).cookie('accessToken', accessToken, options).cookie('refreshToken', refreshToken, options).redirect(`/`)
        }
        else if (verifiedOldToken.role === 'Admin') {
            const adminRefresh = await Admin.findById(verifiedOldToken?._id)

            if (!adminRefresh) {
                res.status(401).send('Invalid Refresh Token!')
            }

            if (oldRefreshToken !== adminRefresh?.refreshToken) {
                res.status(404).redirect('/admin-login')
            }
            const accessToken = generateAdminAccessToken(adminRefresh)
            const refreshToken = generateAdminRefreshToken(adminRefresh)
            adminRefresh.refreshToken = refreshToken;
            await adminRefresh.save({ validateBeforeSave: false })
          return  res.status(200).cookie('accessToken', accessToken, options).cookie('refreshToken', refreshToken, options).redirect(`/`)
        }
        else {
            const studentRefresh = await Student.findById(verifiedOldToken?._id)

            if (!studentRefresh) {
                res.status(401).send('Invalid Refresh Token!')
            }

            if (oldRefreshToken !== studentRefresh?.refreshToken) {
                res.status(404).redirect('/student-login')
            }
            const accessToken =  generateStudentAccessToken(studentRefresh)
            const refreshToken = generateStudentRefreshToken(studentRefresh)
            studentRefresh.refreshToken = refreshToken;
            await studentRefresh.save({ validateBeforeSave: false })
          return  res.status(200).cookie('accessToken', accessToken, options).cookie('refreshToken', refreshToken, options).redirect(`/`)
        }


        


        
    } catch (error) {
        throw new Error('Something went wrong!')
    }

}
module.exports={refreshAccessToken}