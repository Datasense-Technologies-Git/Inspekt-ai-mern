const { User } = require("../models/user");
const datalize = require("datalize");
const field = datalize.field;
const bycrpt = require("bcryptjs");
const { response } = require("express");
const util = require("../helper/util");

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
  } else {
    appData["status"] = 4;
    appData["message"] = "Invalid Details!";
    appData["data"] = [];
    appData["error"] = [];
    res.send(403).status(appData);
  }
};

exports.retiveData = async(req,res)=>{
    try {
        const retrive  = await dataSchema.find({});
        res.json({msg:"All data Retrived",data:retrive})
    } catch (error) {
        res.json({msg:"Something Wrong",data:error})
    }

};

exports.login = async (req, res) => {
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
                    res.status(200).send({
                      token: util.generateAccessToken({
                        user_name: data.user_name,
                        password: data.password,
                      }),
                      tokenExpiry: "365 days",
                      key: keyId,
                      status: 0,
                    });
                  } else {
                    res.status(400).send({
                      status: 4,
                      data: [],
                      message: "Username/Password Mismatch",
                    });
                  }
                }
              );
            } else {
              appData["message"] = "Error decrypting data";
              appData["status"] = 4;
              res.status(400).status(appData);
            }
          }
        );
      } else {
        appData["message"] = "Invalid Credential";
        appData["status"] = 4;
        res.status(400).send(appData);
      }
    });
  } else {
    appData["message"] = "Invalid Credential";
    appData["status"] = 4;
    res.status(400).send(appData);
  }
};

exports.logout = async (req,res) => {
  if(req)
  {
    appData["status"] = 0;
    appData["message"] = "Logout Successfully";
    appData["data"] = [];
    appData["error"] = [];
    res.status(200).send(appData)
  }
}
