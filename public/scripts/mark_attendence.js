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

const attendenceTable=document.querySelector('.updated-attendence-table').firstElementChild
const row=document.createElement('tr')
row.innerHTML=`<td>${updatedStudent.firstname}</td>
<td>${updatedStudent.lastname}</td>
<td>${updatedStudent.rollnum}</td>
<td>${updatedStudent.gender}</td>
<td>${updatedStudent.class}</td>
<td>${updatedStudent.lastmarked}</td>
<td>${attendenceStatus}</td>`
attendenceTable.appendChild(row)
if(document.querySelector('.updated-attendence-table').classList.contains('disp-none')){
    document.querySelector('.updated-attendence-table').classList.remove('disp-none')
}
})