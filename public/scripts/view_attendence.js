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

    const ctx1 = document.getElementById('attendenceChart');

    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: fetchedAttendence.attendenceMonths,
        datasets: [{
          label:'Attendence',
          data: fetchedAttendence.attendenceMonthsPercentage,
          borderWidth: 0,
          barThickness:70,
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
        }
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
                backgroundColor:['#4ab1edeb','#2e2e2eb3'] ,
                borderWidth:0,
                borderColor:'#2e2e2e00'
                
              }]
            
        },
        options: {
            cutout: 115,
           
        }
        
      });
})