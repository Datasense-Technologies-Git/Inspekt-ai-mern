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
  key : {type : String}
});

const User = mongoose.model("User", UserSchema, "user");

module.exports = { User };
