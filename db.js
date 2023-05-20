const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost:27017/Inspket-ai",
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
