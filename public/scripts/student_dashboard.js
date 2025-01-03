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
       
        unitOneScore.innerText=totalMarksUnitOne.toFixed(1)+'%';
      } else{
        unitOneScore.innerText='--';
      }
      if(totalMarksUnitTwo!=null){
        unitTwoScore.innerText=totalMarksUnitTwo.toFixed(1)+'%';
      }else{
        unitTwoScore.innerText='--';
      }
      if(totalMarksUnitThree!=null){
        unitThreeScore.innerText=totalMarksUnitThree.toFixed(1)+'%';
      }else{
        unitThreeScore.innerText='--';
      }
      if(totalMarksUnitFour!=null){
        unitFourScore.innerText=totalMarksUnitFour.toFixed(1)+'%';
      }else{
        unitFourScore.innerText='--';
      }
      if(totalMarksTermOne!=null){
        termOneScore.innerText=totalMarksTermOne.toFixed(1)+'%';
      }else{
        termOneScore.innerText='--';
      }
      if(totalMarksTermTwo!=null){
        termTwoScore.innerText=totalMarksTermTwo.toFixed(1)+'%';
      }else{
        termTwoScore.innerText='--';
      }

      const homeworkCont=document.querySelector('.homework-cont');
      student.homeworks.forEach(homework=>{
        const homeworkDiv=document.createElement('div');
        homeworkDiv.className='homework';
        homeworkDiv.innerHTML=` <div class="homework-details-cont">
        <div class="homework-details">
                    <span id="subject">Subject: ${homework.subject}</span>
                    
                    <span id="date">Date: ${homework.date}</span>
                </div>
                <span id="hw-descrpt" class="homework-descpt">${homework.task}</span>
            </div>
            </div>
            <div class="done-btn">
                <a class="homeworkDone">Done</a>
            </div>`
           
            homeworkCont.appendChild(homeworkDiv);

            document.querySelector('.no-homework').classList.add('disp-none')
})


    
    const homeworkDone = document.querySelectorAll('.homeworkDone');
    
    homeworkDone.forEach(button => {
        button.addEventListener('click',async (e) => {
            const homeworkDisp= e.target.closest('.homework');
            if (homeworkDisp) {
                homeworkCont.removeChild(homeworkDisp);
            }
    
            const subject = homeworkDisp.querySelector('#subject').innerText.split(':')[1].trim();
            const date = homeworkDisp.querySelector('#date').innerText.split(':')[1].trim();
            const homeworkDesc = homeworkDisp.querySelector('#hw-descrpt').innerText;
    
            const homeworkData = { subject, date, homeworkDesc };
           

          await fetch('/student/remove-homework', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(homeworkData)
          });
          
        });
        
      });
     
      if(student.homeworks.length==0){
      if(document.querySelector('.no-homework').classList.contains('disp-none')){
        document.querySelector('.no-homework').classList.remove('disp-none')
      }
  
    }
}
fetchStudentDashboard();