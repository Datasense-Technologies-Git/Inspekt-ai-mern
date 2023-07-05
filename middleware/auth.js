let accessTokenKey = require("../config/config");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const authenticator = (req, res, next) => {
  const authToken = req.headers["x-inspekt-api-token"];
  // const authKey = req.headers["x-inspekt-api-key"];
  const token = authToken;
  if (token === null || token === undefined) {
    return res.status(403).send({ message: "Unauthorized" });
  } else {
    jwt.verify(token, accessTokenKey, async (err, user) => {
      if (err) return res.status(403).send({ message: "Invalid User Token",error:err });
      req.user = user;
      next();
      
      // if (authKey) {
      //   await User.findOne({ key: authKey }, (error, result) => {
      //     if (!error && result) {
      //       next();
      //     } else {
      //       // return res.status(403).send({ message: "Invalid User Key" });
      //       next();
      //     }
      //   });
      // }
    });
  }
};

module.exports = authenticator;
