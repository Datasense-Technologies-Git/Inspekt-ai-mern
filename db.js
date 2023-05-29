const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://dhilip:admin@cluster0.znp2m13.mongodb.net/testing?retryWrites=true&w=majority",
  // "mongodb+srv:mongodb://localhost:27017/Inspket-ai",
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
