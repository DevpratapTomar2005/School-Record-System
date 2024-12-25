const hamburger=document.querySelector('#ham-icon');
const navbar=document.querySelector('.nav')
hamburger.addEventListener('click',()=>{
    if(!navbar.classList.contains('.nav-hamburger')){
        navbar.classList.add('.nav-hamburger')
        hamburger.src='../images/blackcross.svg'
    }
    else{
        navbar.classList.remove('.nav-hamburger')
        hamburger.src='../images/hamburger.svg'
    }

})