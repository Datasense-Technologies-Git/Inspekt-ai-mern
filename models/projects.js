const mongoose = require('mongoose');
var validator = require("validator");
const dataSchema = new mongoose.Schema({
    project_name:{
        type:String,
        // required:[true, "Project name required"],
        // validate(value) {
        //     if (!validator.isLength(value, { min: 3, max: 64 })) {
        //       throw Error("Length of the projectname should be between 3-64");
        //     }
        //   },
        trim:true,
        lowercase: true,
        unique: true,
    },
    project_id:{
        type:String,
        required:true,
        trim:true,
        lowercase: true,
        unique: true,
    },
    cust_name:{
        type:String,
        required:true,
        trim:true,
        lowercase: true,
        unique: true,
    },
    image: {
        type: String
      },
    description:{
        type:String,
        required:false,
        trim:true,
        lowercase: true
    },
    built_year:{
        type:Number,
        required:[true, "must be a number"],
        trim:true
    },
    no_of_floors:{
        type:Number,
        required:true,
        trim:true,
    },
    street_1:{
        type:String,
        required:true,
        trim:true,
        lowercase: true,
        unique: true,
    },
    street_2:{
        type:String,
        required:false,
        trim:true,
        lowercase: true
    },
    city:{
        type:String,
        required:true,
        trim:true,
        lowercase: true
    },
    zipcode:{
        type:String,
        required:true,
        trim:true,
        lowercase: true
    },
    state:{
        type:String,
        required:true,
        trim:true,
        lowercase: true
    },
    country:{
        type:String,
        required:true,
        trim:true,
        lowercase: true
    },
    n_Status: { type: Number, default: 1 },
    n_Deleted: { type: Number, default: 1 },
    dt_CreatedOn: { type: Date, default: Date.now },
})
// {strict: false,versionKey: false}
module.exports=mongoose.model('projects',dataSchema);