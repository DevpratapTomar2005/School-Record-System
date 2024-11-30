const findStudentForm=document.getElementById('findStudentsForm')
findStudentForm.addEventListener('submit',async (e)=>{
   e.preventDefault();
    const studentData={
        studentClass:document.querySelector('#studentClass').value
    }
   
    const getStudents= await fetch('/teacher/get-students',{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(studentData)
    })
    
    const responseStudents=await getStudents.json()
    
    if(document.querySelector('.updated-attendence-table').classList.contains('disp-none')){
        document.querySelector('.updated-attendence-table').classList.remove('disp-none')

    }
    const attendenceTable=document.querySelector('#attendenceTable tbody')
    responseStudents.students.forEach(e => {
        const row=document.createElement('tr')
row.innerHTML=`<td>${e.firstname}</td>
<td>${e.lastname}</td>
<td>${e.rollnum}</td>
<td>${e.class}</td>

<td><select name="attendenceSelect" id="attendenceSelect" class="inputTable" required >
                    <option value="Absent">Absent</option>
                    <option value="Present">Present</option>
                   </select></td>
`
attendenceTable.appendChild(row)
});
}) 
const attendenceForm= document.querySelector('#attendenceForm')
attendenceForm.addEventListener('submit',async (e)=>{
    e.preventDefault(); 

    const tableRows=Array.from(document.querySelectorAll('#attendenceTable tbody tr'));
    const attendenceData=tableRows.map(row=>{
        const attendence=document.querySelector('#attendenceSelect');
        const tableData=document.getElementsByTagName('td');
        const date = new Date()
        const newDate = date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric'})

        return {
            firstname:tableData[0].innerText,
            lastname:tableData[1].innerText,
            rollnum:tableData[2].innerText,
            studentClass:tableData[3].innerText,
            studentAttendence:attendence.value,
            date:newDate
        }
    })

    console.log(attendenceData)
    const markAttendence= await fetch('/teacher/mark-attendence',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({attendenceData})
    })
    const response=await markAttendence.json()
   
    const successPopup = document.querySelector('.success-popup');
if (successPopup.classList.contains('disp-none')) {
    successPopup.classList.remove('disp-none');
    document.getElementById('popup-h2').innerText = response.message;
}
})