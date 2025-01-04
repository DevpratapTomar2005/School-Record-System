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
   
    const homeworkTable=document.querySelector('.updated-homework-table').firstElementChild
const row=document.createElement('tr')
row.innerHTML=`<td>${studentClass}</td>
<td>${response.subject.charAt(0).toUpperCase() + response.subject.slice(1)}</td>
<td>${homework}</td>
<td>${response.date}</td>`

homeworkTable.appendChild(row)
if(document.querySelector('.updated-homework-table').classList.contains('disp-none')){
    document.querySelector('.updated-homework-table').classList.remove('disp-none')
}
})