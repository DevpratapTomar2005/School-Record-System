async function fetchStudentDashboard() {
    const response = await fetch('/student/student-dashboard');
   
    const {attendenceMonths,attendenceMonthsPercentage,attendenceThisYear,currentYear,student} = await response.json();
  
    const ctx1 = document.getElementById('attendenceChart');

    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: attendenceMonths,
        datasets: [{
          label:'Attendence',
          data: attendenceMonthsPercentage,
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
                data: [attendenceThisYear,100-attendenceThisYear],
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
      attendencePercent.innerText=attendenceThisYear.toFixed(1)+'%'
}

fetchStudentDashboard();