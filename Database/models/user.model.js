const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "storeName is required"],
      min: [3, "minimum length 2 char"],
      max: [20, "max length 2 char"],
    },
    email: {
      type: String,
      unique: [true, "email must be unique value"],
      required: [true, "email is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "superAdmin"],
      default: "user",
    },
    photo: {
        id:{type: String},
        url:{type:String}
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    phone: {
      type: String,
      required: [true, "phone required"],
    },
    password: {
      type: String,
      required: [true, "password required"],
    },

    confirmEmail: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
