const mongoose = require('mongoose');
var validator = require("validator");
const dataSchema = new mongoose.Schema({
    project_name:{
        type:String,
        required:true,
        
    },
    project_id:{
        type:String,
        required:true
    },
    cust_name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    built_year:{
        type:String,
        required:true
    },
    no_of_floors:{
        type:String,
        required:true
    },
    street_1:{
        type:String,
        required:true
    },
    street_2:{
        type:String,
        required:true
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
    }
})
module.exports=mongoose.model('projects',dataSchema);