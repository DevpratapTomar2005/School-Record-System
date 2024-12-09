const viewAttendenceForm=document.getElementById("viewAttendenceForm")
viewAttendenceForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const studentClass=document.getElementById('studentClass').value
    const studentRollNum=document.getElementById('studentRollNum').value
    const studentInfo={
        studentClass:studentClass,
        studentRollNum:studentRollNum
    }
    
    const fetchingAttendence=await fetch('/teacher/get-attendence',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({studentInfo})

    })
    const fetchedAttendence=await fetchingAttendence.json();
    console.log(fetchedAttendence)
})