function getMonthFromDate(dateString) {
    const [day, month, year] = dateString.split('/');
    const dateObj = new Date(year, month - 1, day);
    return dateObj.getMonth() + 1;
}
function getMonthName(monthNumber) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];



    return months[monthNumber - 1];
}
module.exports={
    getMonthFromDate,
    getMonthName
}