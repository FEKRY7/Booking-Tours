const mongoose = require('mongoose')

const {Types} = mongoose

const BookingSchema= new mongoose.Schema({

userId:{
    type:Types.ObjectId,
    ref:"User",
    required:true
},

roomId:{
    type:Types.ObjectId,
    ref:"Room",
    required:true
},
checkIn: {
    type:Date,
    required:true,
    default:Date.now

},
 checkOut: {
    type:Date,
    required:true,
},
daysNumber: {
    type:Number,
    required:true,
},
Cancel: {
    type:Boolean,
    default:false,
},
},{timeseries:true})

const BookingModel=mongoose.model("Booking",BookingSchema)

module.exports =  BookingModel