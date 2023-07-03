const mongoose = require('mongoose');
const countrySchema = new mongoose.Schema({})
// module.exports=mongoose.model('CountryList',countrySchema);
const CountryList = mongoose.model("CountryList", countrySchema, "countrylist");

module.exports = { CountryList };