const { User } = require("../models/user");
const datalize = require("datalize");
const field = datalize.field;
const bycrpt = require("bcryptjs");
const { response } = require("express");
const util = require("../helper/util");

var appData = {
  appStatusCode: 0,
  message: "",
  data: [],
  error: [],
};

const saltRounds = 10;

//Simple version, without validation or sanitation
exports.test = function (req, res) {
  res.send("Greetings from the Test!");
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
    else {
      bycrpt.hash(
        req.body.user_name + req.body.password,
        saltRounds,
        async (err, hash) => {
          if (!err) {
            let body = {
              ...req.body,
              password: hash,
              key: util.create_UUID(),
            };
            let newRecord = new User(body);
            newRecord.save((err, response) => {
              console.log(response);
              if (!err) {
                response["password"] = null;
                response;
                res.status(200).send(response);
              } else {
                res.status(400).send(err.message);
              }
            });
          } else {
            res.status(400).send({ message: "Error encrypting data" });
          }
        }
      );
    }
  } 
  else {
    appData["appStatusCode"] = 4;
    appData["message"] = "Invalid Details!";
    appData["data"] = [];
    appData["error"] = [];
    res.status(403).send(appData);
  }
};


exports.login = async (req, res) => {
  try {

    // const {user_name,password} = req.body;

    // if (user_name || password) {
      
    // } else {
      
    // }

    if (req.body?.user_name || req.body?.password) {
      await User.findOne({ user_name: req.body.user_name }, (err, response) => {
        if (!err && response) {
          bycrpt.compare(
            req.body.user_name + req.body.password,
            response.password,
            (expErr, result) => {
              if (!expErr) {
                let keyId = util.create_UUID();
                User.findOneAndUpdate(
                  req.body.user_name,
                  { $set: { key: keyId } },
                  { new: true },
                  (error, data) => {
                    if (!error && result && data) {
                      res.send({
                        appStatusCode:0,
                        message:"Login Successfully",
                        token: util.generateAccessToken({
                          user_name: data.user_name,
                          password: data.password,
                        }),
                        tokenExpiry: "365 days",
                        key: keyId,
                        status: 0,
                      });
                    } else {
                      appData["appStatusCode"] = 4;
                      appData["message"] = "Password required";
                      appData["data"] = [];
                      appData["error"] = [];
                      res.send(appData);
                    }
                  }
                );
              } else {
                      appData["appStatusCode"] = 4;
                      appData["message"] = "Error decrypting data";
                      appData["data"] = [];
                      appData["error"] = [];
                res.send(appData);
              }
            }
          );
        } else {
          appData["appStatusCode"] = 4;
          appData["message"] = "Invalid Credential..User not found.";
          appData["data"] = [];
          appData["error"] = [];
          res.send(appData);
        }
      });
    }
    else{
      appData["appStatusCode"] = 4;
      appData["message"] = "Please enter username and password";
      appData["data"] = [];
      appData["error"] = [];
  res.send(appData);
    }
  } catch (error) {
    
      appData["appStatusCode"] = 4;
      appData["message"] = "Something went wrong";
      appData["data"] = [];
      appData["error"] = error;
  res.send(appData);

  }
   
};

exports.allRegisterUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    if (allUsers.length > 0) {
      
      appData["appStatusCode"] = 0;
      appData["message"] = `You have totally ${allUsers.length} Users`;
      appData["data"] = allUsers;
      appData["error"] = [];
      res.send(appData);
    } else {
      
      appData["appStatusCode"] = 0;
      appData["message"] = "Currently you don't have any Users";
      appData["data"] = allUsers;
      appData["error"] = [];
      res.send(appData);
    }
    
  } catch (error) {
        appData["appStatusCode"] = 1;
        appData["message"] = "Something went wrong";
        appData["data"] = [];
        appData["error"] = [error];

        res.send(appData);
  }
}

exports.logout = async (req,res) => {
  if(req)
  {
    appData["appStatusCode"] = 0;
    appData["message"] = "Logout Successfully";
    appData["data"] = [];
    appData["error"] = [];
    res.status(200).send(appData)
  }
}
