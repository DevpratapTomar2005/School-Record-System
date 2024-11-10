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
    
    if(document.querySelector('.upload-marks-table').classList.contains('disp-none')){
        document.querySelector('.upload-marks-table').classList.remove('disp-none')

    }
    const marksTable=document.querySelector('#marksTable tbody')
    responseStudents.students.forEach(e => {
        const row=document.createElement('tr')
row.innerHTML=`<td>${e.firstname}</td>
<td>${e.lastname}</td>
<td>${e.rollnum}</td>
<td>${e.class}</td>
<td>${responseStudents.subject}</td>
<td><select name="examNameSelect" id="examNameSelect" class="inputTable" required >
                    <option value="Unit Test-1">Unit Test-1</option>
                    <option value="Unit Test-2">Unit Test-2</option>
                    <option value="Term-1">Term-1</option>
                    <option value="Unit Test-3">Unit Test-3</option>
                    <option value="Unit Test-4">Unit Test-4</option>
                    <option value="Term-2">Term-2</option></select></td>
<td><input type="number" class="inputTable" name="totalMarks" max="100" min="1"  required></td>
 <td><input type="number" class="inputTable" name="totalMarks" max="100" min="1"  required></td>`
marksTable.appendChild(row)
});
})
const marksForm=document.getElementById('marksForm')
marksForm.addEventListener('submit', async (e)=> {
    e.preventDefault(); 

    const rows = Array.from(document.querySelectorAll('#marksTable tbody tr'));
    const data = rows.map(row => {
        const inputs = row.querySelectorAll('.inputTable');
        const studentDetails=row.getElementsByTagName('td')
        const date = new Date()
        const newDate = date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric'})
        return {
            firstname:studentDetails[0].innerText,
            lastname:studentDetails[1].innerText,
            rollnum:studentDetails[2].innerText,
            studentClass:studentDetails[3].innerText,
            subject:studentDetails[4].innerText,
            examName:inputs[0].value,
            maxMarks:inputs[1].value,
            obtainedMarks:inputs[2].value,
           markedDate:newDate
        };
    });
    console.log(data)

})