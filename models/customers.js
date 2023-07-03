const mongoose = require('mongoose');
var validator = require("validator");
const shortid = require('shortid');
const customerSchema = new mongoose.Schema({
    user_name:{
        type:String,
        required:[true, "Username is required"],
        validate(value) {
          if (!validator.isLength(value, { min: 3, max: 64 })) {
            throw Error("Length of the Username should be between 3-64");
          }
        },
        trim:true,
        lowercase: true,
        unique: true,
    },
    customer_id:{
        type:String,
        required:true,
        trim:true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password required"],
        trim: true,
        timestamp : true
      },
      customer_name:{
          type:String,
          required:[true, "Customer name is required"],
          validate(value) {
            if (!validator.isLength(value, { min: 3, max: 64 })) {
              throw Error("Length of the Customer name should be between 3-64");
            }
          },
          trim:true,
          unique: true,
          lowercase: true,
      },
      customer_email:{
        type:String,
        required:true,
        trim:true,
        lowercase: true,
        unique: true,
    },
    n_Status: { type: Number,required:true, default: 1 },
    n_Deleted: { type: Number, default: 1 },
    dt_CreatedOn: { type: Date, default: Date.now },
})
// module.exports=mongoose.model('customers',customerSchema);
const Customers = mongoose.model("Customers", customerSchema, "customers");

module.exports = { Customers };