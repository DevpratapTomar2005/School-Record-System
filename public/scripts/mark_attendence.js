const attendenceForm= document.getElementById('attendenceForm')
attendenceForm.addEventListener('submit', async (e)=>{
e.preventDefault();
const studentClass=document.getElementById('studentClass').value
const studentRollNum=document.getElementById('studentRollNum').value
const attendenceStatus=document.getElementById('attendence').value

const studentData= {
    studentClass,
    studentRollNum,
    attendenceStatus
}


const updatedAttendence= await fetch('/teacher/mark-attendence',{
    method:'POST',
    headers:{
        "Content-Type": "application/json"
    },
    body:JSON.stringify(studentData)
})
const updatedStudent= await updatedAttendence.json()
console.log(updatedStudent)
})