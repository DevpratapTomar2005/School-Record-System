const uploadBtn=document.getElementById("changePfp")
const uploadInput=document.getElementById("profileInput")

uploadInput.addEventListener('change', ()=> {
    
    if(uploadBtn.classList.contains("disp-none")){
        uploadBtn.classList.remove("disp-none")
        uploadBtn.classList.add("disp-inline")
    }
  })
