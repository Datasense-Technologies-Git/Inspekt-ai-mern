var express = require("express");
var bodyParser = require("body-parser");
require("./db");
var app = express();

var cors = require("cors");
app.use(cors());
app.use(bodyParser.json({ limit: "150mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "150mb", extended: true }));
const userRoutes = require("./routes/user");

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log("Port is running");
});

app.use("/ins/user", userRoutes);
