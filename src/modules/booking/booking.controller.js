const BookingModel = require("../../../Database/models/Boocking.model.js");
const RoomModel = require("../../../Database/models/Room.model.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utilites/httperespons.js");


const BookingRoom = async (req, res) => {
  try {

    const { checkIn, checkOut, roomId, daysNumber } = req.body;
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    console.log(startDate, endDate);

    // Check if room exists
    const room = await RoomModel.findOne({ _id: roomId });
    if (!room) {
      return First(res, "Room not found", 400, http.FAIL);
    }

    if (startDate >= endDate) {
        return First(res, "invalid Date endDate must be befor start date", 400, http.FAIL);
    }

    const existingBookingOverlap = await BookingModel.findOne({
      roomId,
      $or: [
        // New check-in date is between existing booking's check-in and check-out dates
        { checkIn: { $lt: checkIn }, checkOut: { $gt: checkIn } },
        // New check-out date is between existing booking's check-in and check-out dates
        { checkIn: { $lt: checkOut }, checkOut: { $gt: checkOut } },
        // Existing booking is completely within the new booking's check-in and check-out dates
        { checkIn: { $gte: checkIn }, checkOut: { $lte: checkOut } },
      ],
    });

    if (existingBookingOverlap) {
        return First(res, "Room is not available for the selected date.", 400, http.FAIL);
    }

    const booking = await BookingModel.create({
      checkIn,
      checkOut,
      roomId,
      userId: req.user._id,
      daysNumber,
    });

    return Second(res, "Booking created successfully", 201, http.SUCCESS);
  }catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


//Cancel booking using soft delete
const CancelBooking = async (req, res) => {
  try{

    const { bookingId } = req.params;

    const booking = await BookingModel.findOneAndUpdate(
      { userId: req.user._id, _id: bookingId },
      { Cancel: true },
      { new: true }
    );
    if (!booking) {
        return First(res, "booking not found or somthing wrong", 404, http.FAIL);
    } else {
        return Second(res, ["Booking canceled successfully", booking], 200, http.SUCCESS);
    }
  }catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};


const UpdateBookingRoom = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const BookingFound = await BookingModel.findOne({
      _id: bookingId,
      userId: req.user._id,
    });

    if (!BookingFound) {
      return First(res, "Booking not found", 404, http.FAIL);
    }

    const { checkIn, checkOut, daysNumber } = req.body;
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (startDate >= endDate) {
      return First(res, "Invalid date: check-out date must be after check-in date", 400, http.FAIL);
    }

    const existingBookingOverlap = await BookingModel.findOne({
      roomId: BookingFound.roomId,
      _id: { $ne: bookingId },
      $or: [
        { checkIn: { $lt: endDate }, checkOut: { $gt: startDate } },
        { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } },
        { checkIn: { $gte: checkIn }, checkOut: { $lte: checkOut } },
      ],
    });

    if (existingBookingOverlap) {
        return First(res, "Room is not available for the selected dates", 400, http.FAIL);
    }
       
    const updatedBooking = await BookingModel.findOneAndUpdate(
      { _id: bookingId },
      { checkIn: startDate, checkOut: endDate, daysNumber },
      { new: true }
    );

    return Second(res, ["Booking updated successfully",{booking: updatedBooking}], 200, http.SUCCESS);
  }catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  BookingRoom,
  CancelBooking,
  UpdateBookingRoom,
};
