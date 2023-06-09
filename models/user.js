const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var validator = require("validator");

const UserSchema = new Schema({
  user_name: {
    type: String,
    required: [true, "Username required"],
    validate(value) {
      if (!validator.isLength(value, { min: 3, max: 64 })) {
        throw Error("Length of the username should be between 3-64");
      }
    },
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password required"],
    validate(value) {
      if (!validator.isLength(value, { min: 3, max: 64 })) {
        throw Error("Length of the password should be between 3-64");
      }
    },
    trim: true,
    timestamp : true
  },
  first_name:{
    type:String,
    required:[true, "Firstname required"],
    trim: true,
    validate(value) {
      if (!validator.isLength(value, { min: 3, max: 64 })) {
        throw Error("Length of the firstname should be between 3-64");
      }
    },
  },
  last_name:{
    type:String,
    required:[true, "Lastname required"],
    trim: true,
    validate(value) {
      if (!validator.isLength(value, { min: 3, max: 64 })) {
        throw Error("Length of the lastname should be between 3-64");
      }
    },
  },
  email:{
    type:String,
    required:[true, "Email required"],
    trim: true

  },
  key : {type : String}
},{strict: false,versionKey: false});

const User = mongoose.model("User", UserSchema, "user");

module.exports = { User };
