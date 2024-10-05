const homeworkForm=document.getElementById('homeworkForm')
homeworkForm.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const studentClass= document.getElementById('studentHomeworkClass').value
    const homework=document.getElementById('homework').value
    const homeworkData={
        studentClass,
        homework
    }
  
    const giveHomework= await fetch('/teacher/give-homework', {
        method:'POST',
      headers:{
     'Content-Type':'application/json'
      },
     body:JSON.stringify(homeworkData)
    });
    const response= await giveHomework.json()
    console.log(response)

})