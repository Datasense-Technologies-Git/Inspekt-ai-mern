var express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
require("./db");
var app = express();

var cors = require("cors");
mongoose.set('useFindAndModify', false);
app.use(cors());
app.use(bodyParser.json({ limit: "150mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "150mb", extended: true }));
const userRoutes = require("./routes/routes");
// const customerRoute = require("./routes/customerRoute");


const PORT = process.env.PORT || 3002; 
app.get('/',(req,res) => {
  res.status(200).json({
    message:'Inspekt Ai Server working fine'
  })
})
app.use("/api/v1/ins", userRoutes);
app.use("/upload-images",express.static("upload-images"));
app.listen(PORT, () => {
  console.log("Port is running = ",PORT);
});

// app.use("/ins/user", userRoutes);

// app.use("/api/ins/customer", customerRoute);
