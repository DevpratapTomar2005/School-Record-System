const findStudentForm=document.getElementById('findStudentsForm')
findStudentForm.addEventListener('submit',async (e)=>{
   e.preventDefault();
    const studentData={
        studentClass:document.querySelector('#studentClass').value
    }

    const getStudents= await fetch('/admin/get-students',{
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
row.innerHTML=`<td>${e.firstname.charAt(0).toUpperCase() + e.firstname.slice(1)}</td>
<td>${e.lastname.charAt(0).toUpperCase() + e.lastname.slice(1)}</td>
<td>${e.rollnum}</td>
<td>${e.class}</td>
<td><a href="/admin/student-dashboard/${e.firstname+e.lastname}-${e.rollnum}-${e.class}" class="white">view student</a></td>
`
attendenceTable.appendChild(row)
});

}) 