async function giveTeachers(){

    const getTeachers= await fetch('/admin/get-teachers')
    const responseTeachers=await getTeachers.json()
    if(document.querySelector('.updated-attendence-table').classList.contains('disp-none')){
        document.querySelector('.updated-attendence-table').classList.remove('disp-none')
    
    }
    const attendenceTable=document.querySelector('#attendenceTable tbody')
    responseTeachers.teachers.forEach(e => {
        const row=document.createElement('tr')
    row.innerHTML=`<td>${e.firstname.charAt(0).toUpperCase() + e.firstname.slice(1)}</td>
    <td>${e.lastname.charAt(0).toUpperCase() + e.lastname.slice(1)}</td>
    <td>${e.contactnum}</td>
    <td>${e.subject}</td>
    
    `
    attendenceTable.appendChild(row)
    })
}
giveTeachers()
