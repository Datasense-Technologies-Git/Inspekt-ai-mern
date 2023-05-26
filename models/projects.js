const mongoose = require('mongoose');
var validator = require("validator");
const dataSchema = new mongoose.Schema({
    project_name:{
        type:String,
        required:[true, "Project name required"],
        validate(value) {
            if (!validator.isLength(value, { min: 3, max: 64 })) {
              throw Error("Length of the username should be between 3-64");
            }
          },
        trim:true,
        
    },
    project_id:{
        type:String,
        required:true,
       
    },
    cust_name:{
        type:String,
        required:true
    },
    image: {
        type: String
      },
    description:{
        type:String,
        required:false
    },
    built_year:{
        type:Number,
        required:[true, "must be a number"],
    },
    no_of_floors:{
        type:Number,
        required:true
    },
    street_1:{
        type:String,
        required:true
    },
    street_2:{
        type:String,
        required:false,
    },
    city:{
        type:String,
        required:true
    },
    zipcode:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    n_Status: { type: Number, default: 1 },
    n_Deleted: { type: Number, default: 1 },
    dt_CreatedOn: { type: Date, default: Date.now },
})
module.exports=mongoose.model('projects',dataSchema);