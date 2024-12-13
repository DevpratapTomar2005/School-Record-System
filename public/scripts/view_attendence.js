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
    let name=document.getElementById('name')
    let studentclass=document.getElementById('class')
    let contactnum=document.getElementById('contactnum')
    let rollnum=document.getElementById('rollnum')
    let schoolname=document.getElementById('schoolname')
    let pfp=document.getElementById('pfp')


    name.innerText='Name: '+(fetchedAttendence.student.firstname.charAt(0).toUpperCase() + fetchedAttendence.student.firstname.slice(1)+ " " + fetchedAttendence.student.lastname.charAt(0).toUpperCase() + fetchedAttendence.student.lastname.slice(1)
)
    studentclass.innerText='Class: '+(fetchedAttendence.student.class)
    contactnum.innerText='Contact No.: '+(fetchedAttendence.student.contactnum)
    rollnum.innerText='Roll No.: '+(fetchedAttendence.student.rollnum )
    schoolname.innerText='School: '+(fetchedAttendence.student.schoolname.charAt(0).toUpperCase() + fetchedAttendence.student.schoolname.slice(1) )
    pfp.src=fetchedAttendence.student.imagepath


    const ctx1 = document.getElementById('attendenceChart');

    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: fetchedAttendence.attendenceMonths,
        datasets: [{
          label:'Attendence',
          data: fetchedAttendence.attendenceMonthsPercentage,
          borderWidth: 0,
          barThickness:50,
          borderRadius:5,
        backgroundColor:'#4ab1edeb'
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: 100,
            title: {
                display: true,
                align: 'center',
                text: 'Percentage(%)'
            },
            
          }
        },
        maintainAspectRatio:false
      }
    });
    const ctx2=document.getElementById('attendenceYearChart');
    new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels:[`Present`,'Absent'],
              datasets: [{
                label:'Percentage(%)',
                data: [fetchedAttendence.attendenceThisYear,100-fetchedAttendence.attendenceThisYear],
                backgroundColor:['#4ab1edeb','#3e3b3b'] ,
                borderWidth:0
               
                
              }]
            
        },
        options: {
            cutout: 90,
            maintainAspectRatio:false
           
        }
        
      });
      let attendencePercent=document.getElementById('attendencePercent')
      attendencePercent.innerText=fetchedAttendence.attendenceThisYear.toFixed(1)+'%'
})