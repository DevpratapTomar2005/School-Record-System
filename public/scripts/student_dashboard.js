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

      const testscores=await fetch('/student/student-testscores');
      let {totalMarksUnitOne,totalMarksUnitTwo,totalMarksUnitThree,totalMarksUnitFour,totalMarksTermOne,totalMarksTermTwo}=await testscores.json();
      const unitOneScore=document.getElementById('unit-one-score');
      const unitTwoScore=document.getElementById('unit-two-score');
      const unitThreeScore=document.getElementById('unit-three-score');
      const unitFourScore=document.getElementById('unit-four-score');
      const termOneScore=document.getElementById('term-one-score');
      const termTwoScore=document.getElementById('term-two-score');
      if(totalMarksUnitOne!=null){
       
        unitOneScore.innerText=totalMarksUnitOne+'%';
      } else{
        unitOneScore.innerText='--';
      }
      if(totalMarksUnitTwo!=null){
        unitTwoScore.innerText=totalMarksUnitTwo+'%';
      }else{
        unitTwoScore.innerText='--';
      }
      if(totalMarksUnitThree!=null){
        unitThreeScore.innerText=totalMarksUnitThree+'%';
      }else{
        unitThreeScore.innerText='--';
      }
      if(totalMarksUnitFour!=null){
        unitFourScore.innerText=totalMarksUnitFour+'%';
      }else{
        unitFourScore.innerText='--';
      }
      if(totalMarksTermOne!=null){
        termOneScore.innerText=totalMarksTermOne+'%';
      }else{
        termOneScore.innerText='--';
      }
      if(totalMarksTermTwo!=null){
        termTwoScore.innerText=totalMarksTermTwo+'%';
      }else{
        termTwoScore.innerText='--';
      }

}

fetchStudentDashboard();