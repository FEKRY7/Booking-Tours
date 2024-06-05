const HotelModel = require("../../../Database/models/Hotel.model.js");
const cloudinary = require("../../utilites/cloudinary.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utilites/httperespons.js");

const CreateHotel = async (req, res) => {
  try {
    if (!req.files || !req.files.length) {
      return First(res, "Hotel images are required", 400, http.FAIL);
    } else {
      const images = [];
      const name = req.body.name;

      for (const file of req.files) {
        const { secure_url } = await cloudinary.uploader.upload(file.path, {
          folder: `BookingProject/Hotels/${name}`,
        });
        images.push(secure_url);
      }

      req.body.images = images;
      const newHotel = await HotelModel.create(req.body);

      if (!newHotel) {
        return First(res, "Failed to add Hotel", 400, http.FAIL);
      } else {
        return Second(
          res,
          ["Hotel created successfully", newHotel],
          201,
          http.SUCCESS
        );
      }
    }
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const Hotels = async (req, res) => {
  try {
    const { min, max, ...others } = req.query;
    const Hotels = await HotelModel.find({
      ...others,
      cheapestPrice: { $gt: min | 1, $lt: max || 999 },
    });
    if (!Hotels) {
      return First(res, "not found Hotel", 404, http.FAIL);
    } else {
      return Second(res, ["hotels", Hotels], 201, http.SUCCESS);
    }
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const countCity = async (req, res) => {
  try {
    const { cities } = req.query;
    const list = await Promise.all(
      cities.map((city) => {
        return HotelModel.find({ city: city });
      })
    );
    return Second(res, ["count", list], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const countHotelByType = async (req, res) => {
  try {
    const { type } = req.body;

    const hotel = await HotelModel.find({ type });

    return Second(res, ["count", { type: hotel }], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const getHotelRooms = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await HotelModel.findById(id).populate("Rooms");

    if (!hotel) {
      return First(res, "Hotel not found", 404, http.FAIL);
    }

    const roomList = hotel.Rooms;
    return Second(res, ["Room list", roomList], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const DeleteHotel = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await HotelModel.findById(id);
    if (!hotel) {
      return First(res, "Hotel not found", 404, http.FAIL);
    }

    await hotel.deleteOne(); // Delete the hotel

    return Second(
      res,
      "Hotel has been deleted and its rooms using hooks",
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  CreateHotel,
  Hotels,
  countCity,
  countHotelByType,
  getHotelRooms,
  DeleteHotel,
};
