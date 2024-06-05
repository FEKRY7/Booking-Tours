const express = require('express')
const router = express.Router()
const {CreateHotel,Hotels,countCity,countHotelByType,DeleteHotel,getHotelRooms} = require('../hotel/hotel.controller.js')
const isAuthenticated = require('../../middleware/authentication.middeleware.js')
const isAuthorized = require('../../middleware/authoriztion.middelware.js')
const {validation} = require('../../middleware/validation.middleware.js')
const {fileValidation,myMulter} = require('../../utilites/multer.js')
 

const roomRouter = require('../../modules/rooms/rooms.routes.js')
router.use('/:hotelId/room',roomRouter)


router.post("/Create",
isAuthenticated,
isAuthorized("admin","user","superAdmin"),
myMulter(fileValidation.image).array("images",3),
CreateHotel
) 

router.get("/",Hotels)
router.get("/count",countCity)
router.get("/ByType",countHotelByType)
router.get("/:id",getHotelRooms)
router.delete("/:id",DeleteHotel)


module.exports =  router