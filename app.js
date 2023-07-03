var express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const env = require("dotenv");



env.config();


var app = express();

var cors = require("cors");
mongoose.set('useFindAndModify', false);
app.use(cors());
app.use(bodyParser.json({ limit: "150mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "150mb", extended: true }));
const userRoutes = require("./routes/routes");

// const connectionURL1 = `mongodb+srv://dhilip:admin@cluster0.znp2m13.mongodb.net/testing?retryWrites=true&w=majority` 

const connectionURL = `mongodb+srv://${process.env.MONGO_USER_NAME}:${process.env.MONGO_PASSWORd}@cluster0.znp2m13.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority` 


mongoose.connect(
  connectionURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  },
  (err) => {
    if (!err) {
      console.log("Mongo db connected successfully");
    } else {
      console.log("Error connecting to database : " + err.message);
    }
  }
);







app.get('/api/test',(req,res) => {
  res.status(200).json({
    message:'Inspekt Ai Server working fine 2'
  })
})
app.use("/api/v1/ins", userRoutes);
app.use("/upload-images",express.static("upload-images"));
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// app.use("/ins/user", userRoutes);

// app.use("/api/ins/customer", customerRoute);
