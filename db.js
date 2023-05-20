const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://ashwinraj:voRPTd2YKqeWJWAs@cluster0.lcgjy0u.mongodb.net/Inspeckt-ai",
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
