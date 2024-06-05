const mongoose = require("mongoose");

const { Types } = mongoose;

const RoomModel = require("./Room.model.js");

const HotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "HotelName is required"],
      min: [2, "minimum length 2 char"],
      max: [20, "max length 2 char"],
    },
    desc: {
      type: String,
      required: [true, "description is required"],
    },
    country: {
      type: String,
    },
    city: {
      type: String,
      required: [true, "city is required"],
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
    type: {
      type: String,
      enum: ["hotel", "villa", "department"],
      default: "hotel",
      required: [true, "type is required"],
    },
    distance: {
      type: String,
    },
    images: {
      type: [String],
      required: [true, "Photos is required"],
    },
    Rooms: [
      {
        type: Types.ObjectId,
        ref: "Room",
      },
    ],

    rating: {
      type: Number,
      min: [0, "minimum rating 0"],
      max: [5, "max rating 5"],
    },

    featured: {
      type: Boolean,
      default: false,
    },
    cheapestPrice: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

HotelSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const hotel = this;

    try {
      // Delete the associated rooms
      await RoomModel.deleteMany({ hotelId: hotel._id });
      next();
    } catch (error) {
      next(error);
    }
  }
);

const HotelModel = mongoose.model("Hotel", HotelSchema);
module.exports = HotelModel;
