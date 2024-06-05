const express = require('express')
const router = express.Router({mergeParams:true})

const {RoomAvailability,DeleteRoom,CreateRoom,UpdateRoom} = require('../rooms/rooms.controller.js')
const isAuthenticated = require('../../middleware/authentication.middeleware.js')
const isAuthorized = require('../../middleware/authoriztion.middelware.js')

const {fileValidation,myMulter} = require('../../utilites/multer.js')


router.put('/:hotelId/:roomId',
isAuthenticated,
isAuthorized("admin","user"),
RoomAvailability
)

router.delete('/:hotelId/:roomId',
isAuthenticated,
isAuthorized("admin","user"),
DeleteRoom
)

router.post('/:hotelId',
isAuthenticated,
isAuthorized("admin","user"),
myMulter(fileValidation.image).array("images"),
CreateRoom 
)

router.put('/update/:hotelId/:roomId',
isAuthenticated,
isAuthorized("admin","user"),
myMulter(fileValidation.image).array("image"),
UpdateRoom
)

module.exports =  router