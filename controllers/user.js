const { User } = require("../models/user");
const datalize = require("datalize");
const field = datalize.field;
const bycrpt = require("bcryptjs");
const { response } = require("express");
const jwt = require("jsonwebtoken");
const accessTokenKey = require("../config/config")

var appData = {
  status: 0,
  message: "",
  data: [],
  error: [],
};

const saltRounds = 10;


//Simple version, without validation or sanitation
exports.test = function (req, res) {
  res.send("Greetings from the Test!");
};

exports.checkUser = function (req, res) {
  const data = req.body;
  const errors = {};
  if (!/^(?=.*[A-Za-z]).{3,}$/.test(String(data.c_Name).trim())) {
    errors.c_Name = ["Name is not valid"];
  }

  if (Object.keys(errors).length > 0) {
    appData["status"] = 0;
    appData["message"] = "";
    appData["data"] = [];
    appData["error"] = errors;
    res.send(appData);
  } else {
    try {
      var insertUser = new User(data);
      insertUser.save(function (err, next) {
        if (err) {
          appData["status"] = 0;
          appData["message"] = "";
          appData["data"] = [];

          let errors = {};
          Object.keys(err.errors).forEach((key) => {
            errors[key] = err.errors[key].message;
          });
          appData["error"] = errors;
          res.send(appData);
        } else {
          appData["status"] = 1;
          appData["message"] = "_User Created successfully";
          appData["data"] = next;
          appData["error"] = [];
          res.send(appData);
        }
      });
    } catch (err) {
      appData["status"] = 0;
      appData["message"] = "Getting an error";
      appData["data"] = err;
      appData["error"] = [];
      res.send(appData);
    }
  }
};

exports.register = async (req, res) => {
  if (req.body?.user_name && req.body?.password) {
    const checkUser = await User.find({ user_name: req.body.user_name });
    if (checkUser.length > 0) {
      appData["status"] = 4;
      appData["message"] = "Username already exist!";
      appData["data"] = [];
      appData["error"] = [];
      return res.status(403).send(appData);
    } 
    else{
      bycrpt.hash(req.body.user_name + req.body.password, saltRounds, (err, hash) => {
        if (!err) {
          req.body["password"] = hash;
          let newRecord = new User(req.body);
          newRecord.save((err, response) => {
            if (!err) {
              response["password"] = null;
              response
              res.status(200).send(response);
            } else {
              res.status(400).send(err.message);
            }
          });
        } else {
          res.status(400).send({ message: "Error encrypting data" });
        }
      });
    } 
  } else {
    appData["status"] = 4;
    appData["message"] = "Invalid Details!";
    appData["data"] = [];
    appData["error"] = [];
    res.send(403).status(appData);
  }
};


