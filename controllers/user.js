const { User } = require("../models/user");
const datalize = require("datalize");
const field = datalize.field;
const bycrpt = require("bcryptjs");
const { response } = require("express");
const util = require("../helper/util");

var appData = {
  appStatusCode: 0,
  message: "",
  payloadJson: [],
  error: "",
};

const saltRounds = 10;

//Simple version, without validation or sanitation
exports.test = function (req, res) {
  res.send("Greetings from the Test!");
};

exports.register = async (req, res) => {

 




  if (req.body?.user_name && req.body?.password) {
    const checkUser = await User.find({ user_name: req.body.user_name });
    const checkEmail = await User.findOne({ email: req.body.email });








    if (checkUser.length > 0) {
      appData["status"] = 4;
      appData["message"] = "Username already exist!";
      appData["payloadJson"] = [];
      appData["error"] = [];
      return res.status(403).send(appData);
    } else if(checkEmail){
      appData["status"] = 4;
      appData["message"] = "Email already exist!";
      appData["payloadJson"] = [];
      appData["error"] = [];
      return res.status(403).send(appData);
    }
    else {
      let role = "user";
      const { first_name, last_name, email, password,user_name } = req.body;
      bycrpt.hash(
        req.body.user_name + req.body.password,
        saltRounds,
        async (err, hash) => {
          if (!err) {
            // let body = {
            //   ...req.body,
            //   password: hash,
            //   key: util.create_UUID(),
            // };
            let newRecord = new User({
              user_name,
              password: hash,
              first_name,
              last_name,
              email,
              role,
            });
            newRecord.save((err, response) => {
             
              if (!err) {
                response["password"] = null;
                // response;
                appData["appStatusCode"] = 0;
                appData["message"] = "New User Created Successfully";
                appData["payloadJson"] = [];
                appData["error"] = [];
                res.status(200).send(appData);
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
    appData["payloadJson"] = [];
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

                      

                      appData["appStatusCode"] = 0;
                      appData["message"] = "Login Successfully";
                      appData["payloadJson"] = { 
                        "data" :{
                          "role": data.role,
                          "user_name": data.user_name,
                          "first_name": data.first_name,
                          "last_name": data.last_name,
                          "email": data.email,
                          "token": util.generateAccessToken({
                          user_name: data.user_name,
                          password: data.password,
                        }),
                        "tokenExpiry": "365 days",
                        "key": keyId,
                      }}
                    ;
                      appData["error"] = "";
                      res.send(appData);

                    } else {
                      appData["appStatusCode"] = 4;
                      appData["message"] = "Invalid credential";
                      appData["payloadJson"] = [];
                      appData["error"] = "";
                      res.send(appData);
                    }
                  }
                );
              } else {
                      appData["appStatusCode"] = 4;
                      appData["message"] = "Error decrypting data";
                      appData["payloadJson"] = [];
                      appData["error"] = "";
                res.send(appData);
              }
            }
          );
        } else {
          appData["appStatusCode"] = 4;
          appData["message"] = "Invalid Credential..User not found.";
          appData["payloadJson"] = [];
          appData["error"] = "";
          res.send(appData);
        }
      });
    }
    else{
      appData["appStatusCode"] = 4;
      appData["message"] = "Please enter username and password";
      appData["payloadJson"] = [];
      appData["error"] = "";
  res.send(appData);
    }
  } catch (error) {
    
      appData["appStatusCode"] = 4;
      appData["message"] = "Something went wrong";
      appData["payloadJson"] = [];
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
      appData["payloadJson"] = allUsers;
      appData["error"] = [];
      res.send(appData);
    } else {
      
      appData["appStatusCode"] = 0;
      appData["message"] = "Currently you don't have any Users";
      appData["payloadJson"] = allUsers;
      appData["error"] = [];
      res.send(appData);
    }
    
  } catch (error) {
        appData["appStatusCode"] = 1;
        appData["message"] = "Something went wrong";
        appData["payloadJson"] = [];
        appData["error"] = [error];

        res.send(appData);
  }
}

exports.logout = async (req,res) => {
  if(req)
  {
    appData["appStatusCode"] = 0;
    appData["message"] = "Logout Successfully";
    appData["payloadJson"] = [];
    appData["error"] = [];
    res.status(200).send(appData)
  }
}
