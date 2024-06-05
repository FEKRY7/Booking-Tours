const userModel = require("../../../Database/models/user.model.js");
const tokenModel = require("../../../Database/models/tokenModel.js");
const sendEmail = require("../../utilites/sendEmail.js");
const bcryptjs = require("bcrypt");
const jwt = require("jsonwebtoken");
const signUpTemplate = require("../../utilites/htmlTemplets.js");
const cloudinary = require("../../utilites/cloudinary.js");
const http = require("../../folderS,F,E/S,F,E.JS");
const { First, Second, Third } = require("../../utilites/httperespons.js");


const SignUp = async (req, res) => {
  try {
    const isUser = await userModel.findOne({ email: req.body.email });
    if (isUser) {
      return First(res, "User already exists", 409, http.FAIL);
    }

    req.body.password = bcryptjs.hashSync(req.body.password, 8);
    const token = jwt.sign(
      { email: req.body.email, id: req.body._id },
      process.env.JWT_SECRET_KEY
    );

    if (!req.files || req.files.length === 0) {
      return First(res, "Photo is required", 400, http.FAIL);
    }

    const userName = req.body.userName;
    if (!userName) {
      return First(res, "Username is required", 400, http.FAIL);
    }

    for (const file of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        { folder: `BookingProject/User/${userName}` }
      );
      req.body.photo = { id: public_id, url: secure_url };
    }

    const user = await userModel.create(req.body);
    const html = signUpTemplate(
      `http://localhost:3000/api/auth/activate_account/${token}`
    );

    const messageSent = await sendEmail({
      to: user.email,
      subject: "Account Activation",
      html,
    });

    if (!messageSent) {
      return First(res, "Failed to send activation email", 400, http.FAIL);
    }

    return Second(
      res,
      ["User Created, Please activate your account", token],
      201,
      http.SUCCESS
    );
  } catch (error) {
    console.error("Error in SignUp:", error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const ConfirmEmail = async (req, res) => {
  try {
    // receving the token from the params
    const { token } = req.params;
    // decoding the token to get the payload
    const payLoad = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Searching for the user in DataBase
    const isUser = await userModel.findOneAndUpdate(
      { email: payLoad.email },
      { confirmEmail: true },
      { new: true }
    );
    if (!isUser) {
      return First(res, "User not found.", 404, http.FAIL);
    }
    // Creating an empty Cart once the user active his account

    Second(
      res,
      ["Account Activated , Try to login ", isUser],
      200,
      http.SUCCESS
    );
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const SignIn = async (req, res) => {
  try {
    // distructing the req.body
    const { email, password } = req.body;
    // searching for the user in database
    const isUser = await userModel.findOne({ email });
    if (!isUser) {
      return First(res, "Invalid Email", 404, http.FAIL);
    }
    // making sure that the user has activated the account
    if (!isUser.confirmEmail) {
      return First(res, "Please Confirm your email", 400, http.FAIL);
    }
    // comparing the hashed password with the req.body password
    const match = await bcryptjs.compare(password, isUser.password);
    console.log(isUser);
    // sending a response if the passwords dosent match
    if (!match) {
      return First(res, "Invalid password", 400, http.FAIL);
    }
    // creating a token for using it in authentication and autorization
    const token = jwt.sign(
      { email, id: isUser._id },
      process.env.JWT_SECRET_KEY
    );
    // saving the token in token model (this an  optional  step)
    await tokenModel.create({ token, user: isUser._id });
    // sending the response
    return Second(res, ["you are loggedin", token], 200, http.SUCCESS);
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userModel
      .findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true })
      .select("email userName");

    if (!user) {
      return First(res, "User not found or failed to update", 404, http.FAIL);
    } else {
      return Second(res, "User updated", 200, http.SUCCESS);
    }
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndDelete(id).select("email userName");

    if (!user) {
      return First(res, "User not found or failed to delete", 404, http.FAIL);
    } else {
      return Second(res, "User has been deleted", 200, http.SUCCESS);
    }
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select("email userName");

    if (!users) {
      return First(res, "Users not found", 404, http.FAIL);
    } else {
      return Second(res, ["Users found", users], 200, http.SUCCESS);
    }
  } catch (error) {
    console.error(error);
    return Third(res, "Internal Server Error", 500, http.ERROR);
  }
};

module.exports = {
  SignUp,
  ConfirmEmail,
  SignIn,
  updateUser,
  deleteUser,
  getUsers,
};
