const {getMonthFromDate,getMonthName}=require('../utils/getMonthsFunc.js')
function sortAttendenceAccordingToMonth(student){
    
    const currentDate=new Date()
    
    const currentMonth=currentDate.getMonth()+1
    const lastMonth=currentDate.getMonth()
    const secondLastMonth=currentDate.getMonth()-1
    const thirdLastMonth=currentDate.getMonth()-2
    const fourthLastMonth=currentDate.getMonth()-3
    
    
    const currentMonthAttendence=student.attendence.map(att=>{
     
      if(getMonthFromDate(att.attendenceDate)==currentMonth){
        return att;
      }
    })
    const lastMonthAttendence=student.attendence.map(att=>{
     
      if(getMonthFromDate(att.attendenceDate)==lastMonth){
        return att;
      }
    })
    const secondLastMonthAttendence=student.attendence.map(att=>{
     
      if(getMonthFromDate(att.attendenceDate)==secondLastMonth){
        return att;
      }
    })
    const thirdLastMonthAttendence=student.attendence.map(att=>{
     
      if(getMonthFromDate(att.attendenceDate)==thirdLastMonth){
        return att;
      }
    })
    const fourthLastMonthAttendence=student.attendence.map(att=>{
     
      if(getMonthFromDate(att.attendenceDate)==fourthLastMonth){
        return att;
      }
    })
    
    let currentMonthPresentDays=0;
    let currentMonthAbsentDays=0;
    let lastMonthPresentDays=0;
    let lastMonthAbsentDays=0;
    let secondLastMonthPresentDays=0;
    let secondLastMonthAbsentDays=0;
    let thirdLastMonthPresentDays=0;
    let thirdLastMonthAbsentDays=0;
    let fourthLastMonthPresentDays=0;
    let fourthLastMonthAbsentDays=0;
    
    
    currentMonthAttendence.forEach(e=>{
    if(e && e.studentAttendence==='Present'){
      currentMonthPresentDays=currentMonthPresentDays+1;
     }
     if(e && e.studentAttendence==='Absent'){
      currentMonthAbsentDays=currentMonthAbsentDays+1;
     }
     
    })
    lastMonthAttendence.forEach(e=>{
    if(e && e.studentAttendence==='Present'){
      lastMonthPresentDays=lastMonthPresentDays+1;
    }
    if(e && e.studentAttendence==='Absent'){
      lastMonthAbsentDays=lastMonthAbsentDays+1;
    }
    
    })
    secondLastMonthAttendence.forEach(e=>{
    if(e && e.studentAttendence==='Present'){
      secondLastMonthPresentDays=secondLastMonthPresentDays+1;
    }
    if(e && e.studentAttendence==='Absent'){
      secondLastMonthAbsentDays=secondLastMonthAbsentDays+1;
    }
    
    })
    thirdLastMonthAttendence.forEach(e=>{
    if(e && e.studentAttendence==='Present'){
      thirdLastMonthPresentDays=thirdLastMonthPresentDays+1;
    }
    if(e && e.studentAttendence==='Absent'){
      thirdLastMonthAbsentDays=thirdLastMonthAbsentDays+1;
    }
    
    })
    fourthLastMonthAttendence.forEach(e=>{
    if(e && e.studentAttendence==='Present'){
      fourthLastMonthPresentDays=fourthLastMonthPresentDays+1;
    }
    if(e && e.studentAttendence==='Absent'){
      fourthLastMonthAbsentDays=fourthLastMonthAbsentDays+1;
    }
    
    })
    
    let currentMonthPercentage=(currentMonthPresentDays/(currentMonthPresentDays+currentMonthAbsentDays))*100
    let lastMonthPercentage=(lastMonthPresentDays/(lastMonthPresentDays+lastMonthAbsentDays))*100
    let secondLastMonthPercentage=(secondLastMonthPresentDays/(secondLastMonthPresentDays+secondLastMonthAbsentDays))*100
    let thirdLastMonthPercentage=(thirdLastMonthPresentDays/(thirdLastMonthPresentDays+thirdLastMonthAbsentDays))*100
    let fourthLastMonthPercentage=(fourthLastMonthPresentDays/(fourthLastMonthPresentDays+fourthLastMonthAbsentDays))*100
    
    if(isNaN(currentMonthPercentage))
    {
    currentMonthPercentage=0
    }
    if(isNaN(lastMonthPercentage))
    {
    lastMonthPercentage=0
    }
    if(isNaN(secondLastMonthPercentage))
    {
    secondLastMonthPercentage=0
    }
    if(isNaN(thirdLastMonthPercentage))
    {
    thirdLastMonthPercentage=0
    }
    if(isNaN(fourthLastMonthPercentage))
    {
    fourthLastMonthPercentage=0
    }
    const attendenceMonths=[getMonthName(fourthLastMonth),getMonthName(thirdLastMonth),getMonthName(secondLastMonth),getMonthName(lastMonth),getMonthName(currentMonth)]
    const attendenceMonthsPercentage=[fourthLastMonthPercentage,thirdLastMonthPercentage,secondLastMonthPercentage, lastMonthPercentage,currentMonthPercentage]
    return {attendenceMonths,attendenceMonthsPercentage};
}
module.exports={
    sortAttendenceAccordingToMonth
}