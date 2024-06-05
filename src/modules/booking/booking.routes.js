const express = require('express')
const router = express.Router()

const {BookingRoom,CancelBooking,UpdateBookingRoom} = require('../booking/booking.controller.js')
const isAuthenticated = require('../../middleware/authentication.middeleware.js')
const isAuthorized = require('../../middleware/authoriztion.middelware.js')

router.post("/",
isAuthenticated,
isAuthorized("admin","user"),
BookingRoom
)

router.put("/:bookingId",
isAuthenticated,
isAuthorized("admin","user"),
CancelBooking
)

router.put("/Update/:bookingId",
isAuthenticated,
isAuthorized("admin","user"),
UpdateBookingRoom
)

module.exports =  router