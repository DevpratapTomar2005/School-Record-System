const hamburger=document.querySelector('#ham-icon');
const navbar=document.querySelector('.nav');
const navlinks=document.querySelector('.nav-links');
const logoutBox=document.querySelector('.logout-box')
hamburger.addEventListener('click',()=>{
    if(!navbar.classList.contains('.nav-hamburger')){
        navbar.classList.add('.nav-hamburger')
        hamburger.src='../images/blackcross.svg'
        navbar.style.height='100%'
        navbar.style.paddingBottom='20px'
        navlinks.style.display='flex'
        logoutBox.style.display='block'
    }
    else{
        navbar.classList.remove('.nav-hamburger')
        hamburger.src='../images/hamburger.svg'
           navbar.style.height='8vh'
           navbar.style.paddingBottom='0px'
         navlinks.style.display='none'
        logoutBox.style.display='none'
    }

})