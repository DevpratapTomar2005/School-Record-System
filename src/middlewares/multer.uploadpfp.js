const multer=require("multer")
const path=require('path')


const uploadImgPath='./public/uploads/img';



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
     return cb(null, uploadImgPath)
    },
    filename: function (req, file, cb) {
     
    return  cb(null, `${req.user._id + '-' +file.fieldname+path.extname(file.originalname)}`)
    
    }
  })
  const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/; 
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true); 
    } else {
      cb(new Error('Only images can be uploaded!'), false); 
    }
  }
  const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
  })



  module.exports={upload}