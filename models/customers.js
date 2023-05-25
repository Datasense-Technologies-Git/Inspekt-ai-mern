const mongoose = require('mongoose');
var validator = require("validator");
const shortid = require('shortid');
const dataSchema = new mongoose.Schema({
    user_name:{
        type:String,
        required:[true, "Customer name is required"],
        trim:true,
    },
    user_id:{
        type:String,
        required:true
    },
    customer_name:{
        type:String,
        required:true
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
      customer_email:{
        type:Number,
        required:true
    },
    n_Status: { type: Number, default: 1 },
    n_Deleted: { type: Number, default: 1 },
    dt_CreatedOn: { type: Date, default: Date.now },
})
module.exports=mongoose.model('customers',dataSchema);