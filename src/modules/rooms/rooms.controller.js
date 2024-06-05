const HotelModel = require("../../../Database/models/Hotel.model.js");
const RoomModel = require("../../../Database/models/Room.model.js");
const cloudinary = require("../../utilites/cloudinary.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utilites/httperespons.js");

const CreateRoom = async (req, res, next) => {
  try {

    const { hotelId } = req.params;

    if (!req.files) {
      return First(res, "image is required", 400, http.FAIL);
    } else {
      const hotel = await HotelModel.findById(hotelId);
      if (!hotel) {
        return First(res, "Hotel not found", 404, http.FAIL);
      } else {

        req.body.hotelId = hotelId;
        for (const file of req.files) {
          const { secure_url, public_id } = await cloudinary.uploader.upload(
            file.path,
            { folder: `BookingProject/Room/${hotelId}` }
          );
          req.body.image = secure_url;
          req.body.imagePublicId = public_id;
        }

        const NewRoom = new RoomModel(req.body);
        const savedRoom = await NewRoom.save();

        const RoomHotel = await HotelModel.findByIdAndUpdate(hotelId, {
          $push: { Rooms: savedRoom._id },
        });

        return Second(res, ["room added", savedRoom], 200, http.SUCCESS);
      }
    }
  }catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const RoomAvailability = async (req, res) => {
  try {
    const { hotelId, roomId } = req.params; // Correct parameter name for roomId

    // Find the room based on roomId and hotelId
    const room = await RoomModel.findOne({ _id: roomId, hotelId: hotelId });

    if (!room) {
      return First(res, "Room not found", 404, http.FAIL);
    }

    // Update the room's availability
    const updatedRoom = await RoomModel.findOneAndUpdate(
      { _id: roomId, hotelId: hotelId },
      { available: req.body.available },
      { new: true }
    );

    return Second(res, "Room availability updated", 200, http.SUCCESS);

  }catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const DeleteRoom = async (req, res) => {
  try {

    const { hotelId, roomId } = req.params;

    // Find and delete the room
    const room = await RoomModel.findOneAndDelete({ _id: roomId, hotelId });

    if (!room) {
      return First(res, "Room not found", 404, http.FAIL);
    }

    // Delete the room image from Cloudinary
    if (room.imagePublicId) {
      await cloudinary.uploader.destroy(room.imagePublicId);
    }

    return Second(res, `Room with ID: ${roomId} has been deleted`, 200, http.SUCCESS);
  
  }catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const UpdateRoom = async (req, res) => {
  try {
    const { hotelId, roomId } = req.params;

    // Find the room by roomId and hotelId
    const room = await RoomModel.findOne({ _id: roomId, hotelId });
    if (!room) {
      return First(res, "Room not found", 404, http.FAIL);
    }

    // If new images are provided, upload them to Cloudinary and update the room
    if (req.files && req.files.length > 0) {
      // Upload new images
      for (const file of req.files) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          file.path,
          { folder: `BookingProject/Room/${hotelId}` }
        );
        req.body.image = secure_url;
        req.body.imagePublicId = public_id;
      }

      // Delete the old image from Cloudinary
      if (room.imagePublicId) {
        await cloudinary.uploader.destroy(room.imagePublicId);
      }
    }

    // Update the room with new details
    const updatedRoom = await RoomModel.findOneAndUpdate(
      { _id: roomId, hotelId },
      { $set: req.body },
      { new: true } // Return the updated document
    );

    return Second(res, [`Room with ID: ${roomId} has been updated`,updatedRoom], 200, http.SUCCESS);
  
  }catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  CreateRoom,
  RoomAvailability,
  DeleteRoom,
  UpdateRoom,
};
