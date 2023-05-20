const mongoose = require("mongoose");

const AutoIncrement = require("mongoose-sequence")(mongoose);
var Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");
var validator = require("validator");

const UserSchema = new Schema(
  {
    c_Name: {
      type: String,
      required: [true, "Name required"],
      validate(value) {
        if (!validator.isLength(value, { min: 3, max: 64 })) {
          throw Error("Length of the name should be between 3-64");
        }
      },
      trim: true,
    },
    n_Mobile: {
      type: Number,
      index: true,
      unique: true,
      required: [true, "Mobile number required"],
      validate: {
        validator: function (v) {
          return /^[6789]\d{9}$/.test(v);
        },
        message: "{VALUE} is not a valid 10 digit number!",
      },
      trim: true,
    },
    c_Email: { type: String, required: false },
    c_Password: { type: String, required: false },
    n_Status: { type: Number, default: 1 },
    n_Deleted: { type: Number, default: 1 },
    dt_CreatedOn: { type: Date, default: Date.now },
    dt_LastUpdatedOn: { type: Date, default: null },
    dt_LastLogin: { type: Date, default: null },
  },
  {
    strict: false,
    versionKey: false, // You should be aware of the outcome after set to false
  }
);
// UserSchema.plugin(AutoIncrement, {inc_field: 'id'});

// User Payment Details
const UserPaySchema = new Schema(
  {
    user_id: { type: String, required: [true, "User Id required"], max: 100 },
    department: {
      type: String,
      required: [true, "Department required"],
      max: 100,
    },
    user_type: {
      type: String,
      required: [true, "User type required"],
      max: 100,
    },
    type_val: {
      type: String,
      required: [true, "User type value required"],
      max: 100,
    },
    esi_val: { type: String, required: [true, "ESI Value required"], max: 100 },
    pf_val: { type: String, required: [true, "PF Value required"], max: 100 },
    basic_pay: {
      type: String,
      required: [true, "Basic pay required"],
      max: 100,
    },
    aid: { type: Number, required: false },
    cid: { type: Number, required: false },
    id: { type: Number, required: false },
    status: { type: String, required: false },
    deleted: { type: String, required: false },
    createdate: { type: String, required: false },
    lastupdate: { type: String, required: false },
    upload: { type: String, required: false },
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  }
);

const User = mongoose.model("User", UserSchema, "ds_users");
const UserPay = mongoose.model("UserPay", UserPaySchema, "3kmd_user_payment");

//User paginate
const UserPaginateschema = new Schema({});
UserPaginateschema.plugin(mongoosePaginate);
const UsersPaginate = mongoose.model(
  "UsersPaginate",
  UserPaginateschema,
  "ds_users"
);
module.exports = { User, UserPay, UsersPaginate };
