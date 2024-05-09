
const UserModel = require("../models/user");
const userService = require("../services/userService");
const jwt = require('jsonwebtoken');

const bcrypt = require("bcrypt");

exports.registerUser = async (params) => {
    if (
      !params.firstName ||
      !params.lastName ||
      !params.email ||
      !params.phoneNumber ||
      !params.password
    )
      throw Error("The request is missing one or more fields");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(params.password, salt);
  
    const newUser = new UserModel({
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      phoneNumber: params.phoneNumber,
      password: hashedPassword,
    });
    return await newUser.save();
  };

  exports.loginUser = async (params) => {
    if (!params.email || !params.password) {
      throw Error("The request is missing the email or the password");
    }
    const user = await UserModel.findOne({email:params.email});
    if (!user) {
      throw Error("No account was found with this email");
    }
    if (user && !user.isActive)  {
        throw Error("You don't have an active account");
      }
    const isMatch = await bcrypt.compare(params.password, user.password);
    if (!isMatch) {
      throw Error("Invalid password or email");
    }

    const responseObject = {"accessToken" : jwt.sign( {id:user.id, role:user.role}, "secretOrPrivateKey", {expiresIn: "1h" })}

   return responseObject


  
  };