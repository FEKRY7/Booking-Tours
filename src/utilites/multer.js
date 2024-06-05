const multer = require('multer');

const fileValidation = {
    image: ['image/png', 'image/jpeg', 'image/jif'],
    pdf: ['application/pdf'],

}


const myMulter = (customValidation=fileValidation.image)=> {
 
    const storage = multer.diskStorage({})

    function fileFilter(req, file, cb) {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb('invalid format', false)
        }
    }
    const upload = multer({ fileFilter, storage })
    return upload
}

module.exports = {
    fileValidation,
    myMulter  
} 
