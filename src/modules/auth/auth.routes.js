const express = require('express')
const router = express.Router()
const {SignIn,SignUp,ConfirmEmail,updateUser,deleteUser,getUsers} = require('../auth/auth.controller.js')
const isAuthenticated = require('../../middleware/authentication.middeleware.js')
const isAuthorized = require('../../middleware/authoriztion.middelware.js')
const {validation} = require('../../middleware/validation.middleware.js')
const {SignUpSchema ,activateAcountSchema, signInSchema} = require('../auth/auth.validation.js')
const {fileValidation,myMulter} = require('../../utilites/multer.js')

router.post("/SignUp",
// validation(SignUpSchema),
myMulter(fileValidation.image).array("photo"),
SignUp
)

  
router.get('/activat_account/:token',validation(activateAcountSchema),ConfirmEmail)

router.post('/signIn',validation(signInSchema),SignIn)

router.put('/update',isAuthenticated,isAuthorized("user"),updateUser)

router.delete('/delete/:id',isAuthenticated,isAuthorized("admin"),deleteUser)

router.get('/',isAuthenticated,isAuthorized("user"),getUsers)

module.exports = router