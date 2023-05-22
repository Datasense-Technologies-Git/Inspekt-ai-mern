const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://dhilip:admin@cluster0.znp2m13.mongodb.net/testing?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      console.log("Mongo db connected successfully");
    } else {
      console.log("Error connecting to database : " + err.message);
    }
  }
);
