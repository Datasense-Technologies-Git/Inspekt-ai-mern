const { User } = require("../models/user");
const datalize = require("datalize");
const field = datalize.field;
const bcrypt = require("bcryptjs");
const { response } = require("express");
const util = require("../helper/util");
const { body } = require("express-validator");
const shortid = require("shortid");

var appData = {
  appStatusCode: 0,
  message: "",
  payloadJson: [],
  error: "",
};
var appData1 = {
  appStatusCode: "",
  message: "",
  data: [],
  error: "",
};

const saltRounds = 10;

//Simple version, without validation or sanitation
exports.test = function (req, res) {
  res.send("Greetings from the Test!");
};

// exports.register = async (req, res) => {
//   if (req.body?.user_name && req.body?.password) {
//     const checkUser = await User.find({ user_name: req.body.user_name });
//     const checkEmail = await User.findOne({ email: req.body.email });
//     if (checkUser.length > 0) {
//       appData["status"] = 4;
//       appData["message"] = "Username already exist!";
//       appData["payloadJson"] = [];
//       appData["error"] = [];
//       return res.status(403).send(appData);
//     } else if(checkEmail){
//       appData["status"] = 4;
//       appData["message"] = "Email already exist!";
//       appData["payloadJson"] = [];
//       appData["error"] = [];
//       return res.status(403).send(appData);
//     }
//     else {
//       let role = "user";
//       const { first_name, last_name, email, password,user_name } = req.body;
//       bcrypt.hash(
//         req.body.user_name + req.body.password,
//         saltRounds,
//         async (err, hash) => {
//           if (!err) {
//             // let body = {
//             //   ...req.body,
//             //   password: hash,
//             //   key: util.create_UUID(),
//             // };
//             let newRecord = new User({
//               user_name,
//               password: hash,
//               first_name,
//               last_name,
//               email,
//               role,
//             });
//             newRecord.save((err, response) => {

//               if (!err) {
//                 response["password"] = null;
//                 // response;
//                 appData["appStatusCode"] = 0;
//                 appData["message"] = "New User Created Successfully";
//                 appData["payloadJson"] = [];
//                 appData["error"] = [];
//                 res.status(200).send(appData);
//               } else {
//                 res.status(400).send(err.message);
//               }
//             });
//           } else {
//             res.status(400).send({ message: "Error encrypting data" });
//           }
//         }
//       );
//     }
//   }
//   else {
//     appData["appStatusCode"] = 4;
//     appData["message"] = "Invalid Details!";
//     appData["payloadJson"] = [];
//     appData["error"] = [];
//     res.status(403).send(appData);
//   }
// };

exports.logIn1 = async (req, res) => {
  try {
    let result = req.body;
    if (result.user_name || result.password) {
      const userName = await User.findOne({ user_name: result.user_name });
      if (!userName) {
        appData["appStatusCode"] = 4;
        appData["message"] = "User not found";
        appData["payloadJson"] = [];
        appData["error"] = "";
        res.send(appData);
      } 
      const userPass = await bcrypt.compare(result.password, userName.password);
      if (!userPass ) {
        appData["appStatusCode"] = 4;
        appData["message"] = "Invalid credential";
        appData["payloadJson"] = [];
        appData["error"] = "";
        res.send(appData);
      } 
      else {
        // res.json("login successfully");
        const tokenVerify = util.generateAccessToken({
          user_name: result.user_name,
          password: result.password,
        });

        appData["appStatusCode"] = 0;
        appData["message"] = "Login Successfully";
        appData["payloadJson"] = {
          data: {
            roles: userName.role,
            user_name: userName.user_name,
            first_name: userName.first_name,
            last_name: userName.last_name,
            email: userName.user_email,
            token: tokenVerify,
            tokenExpiry: "365 days",
          },
        };
        appData["error"] = "";
        res.send(appData);
      }
    } else {
      appData["appStatusCode"] = 4;
      appData["message"] = "Please enter username and password";
      appData["payloadJson"] = [];
      appData["error"] = "";
      res.send(appData);
    }
  } catch (error) {
    appData["appStatusCode"] = 4;
    appData["message"] = "Error";
    appData["payloadJson"] = [];
    appData["error"] = error;
    res.send(appData);
  }

  // const token = jwt.sign({id:userEmail._id,isAdmin:userEmail.isAdmin},process.env.TOKENKEY);
  // res.cookie("sample",token,{
  //     httpOnly:true
  // }).json("Login Successfully")
};

exports.createUser = async (req, res) => {
  try {
    const result = req.body;
    const checkUserName = await User.findOne({
      user_name: req.body.user_name,
    });
    const checkUserEmail = await User.findOne({
      user_email: req.body.user_email,
    });
    //
    if (checkUserName || checkUserEmail) {
      appData1["appStatusCode"] = 0;
      appData1["message"] =
        "Please check. user name or user email already exist";
      appData1["data"] = [];
      appData1["error"] = [];
      res.send(appData1);
    } else if (!util.isEmail(req.body.user_email)) {
      appData1["appStatusCode"] = 0;
      appData1["message"] = "Please enter valid email";
      appData1["data"] = [];
      appData1["error"] = [];
      res.send(appData1);
    } else {
      console.log("----- initial");
      const { user_name, first_name, last_name, user_email, password, role } =
        req.body;
      const hashPass = await bcrypt.hash(password, 7);
      console.log("----- test");
      const userdata = new User({
        user_name,
        user_id: shortid.generate(),
        first_name,
        last_name,
        user_email,
        role,
        password: hashPass,
      });
      console.log("----- first");
      console.log(userdata, "----- userdata");
      userdata.save(function (err, data) {
        console.log("----- second");
        if (err) {
          console.log("----- third");
          appData1["appStatusCode"] = 2;
          appData1["message"] = "some error";
          appData1["data"] = [];
          appData1["error"] = err.message;

          res.send(appData1);
        } else {
          console.log("----- four");
          appData1["appStatusCode"] = 0;
          appData1["message"] = "User added Successfully";
          appData1["data"] = data;
          appData1["error"] = [];
          res.send(appData1);
        }
      });
    }
  } catch (error) {
    appData1["appStatusCode"] = 2;
    appData1["message"] = "Oops01, Something went wrong !";
    appData1["data"] = [];
    appData1["error"] = error;
    res.send(appData1);
  }
};

exports.allRegisterUsers = async (req, res) => {
  try {
    const result = req.body;

    let temp_skip = ((result.n_skip) * result.n_limit);
    let temp_limit = (result.n_skip + 1) * result.n_limit;
    let _search = { n_Deleted: 1 };

    if (result.searchTerm) {
      _search["$or"] = [
        { user_name: { $regex: result.searchTerm, $options: "i" } },
        { user_email: { $regex: result.searchTerm, $options: "i" } },
      ];
    }

    if(result.user_status === 0 || result.user_status === 1 ) {

      _search['n_Status'] = {$eq: result.user_status}
    }

    User.aggregate([
      { $match: _search },
      // {
      //     $lookup: {
      //         from: "projects",
      //         localField: 'customer_name',
      //         foreignField: "cust_name",
      //         as: "product"
      //     },

      // },
      // {
      //   $lookup: {
      //     from: "inspections",
      //     localField: 'product.project_name',
      //     foreignField: "project_name",
      //     as: "second"
      // }
      // },

      {
        $group: {
          _id: "$_id",
          user_name: { $first: "$user_name" },
          first_name: { $first: "$first_name" },
          last_name: { $first: "$last_name" },
          user_id: { $first: "$user_id" },
          user_email: { $first: "$user_email" },
          n_Deleted: { $first: "$n_Deleted" },
          n_Status: { $first: "$n_Status" },
          // project_inspections: {$push: "$second"}
        },
      },
      { $sort: { user_name: result.sort } },
      {
        $facet: {
          paginatedResults: [{ $skip:temp_skip  }, { $limit: temp_limit }],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ])
      .then(function (docs) {
        if (docs) {
          // docs[0].paginatedResults.map((data,i)=>{
          //      let new_projects = data.projects.flat(1);
          //      let latest_project = [];
          //      new_projects.map((el)=>{
          //          if (el.n_Deleted === 1) {
          //           latest_project.push(el)
          //          }
          //        })
          //        data.projects = latest_project.length;
          //   })

          appData1["appStatusCode"] = 0;
          appData1["message"] = `Your all users`;
          appData1["data"] = docs;
          appData1["error"] = [];
          res.send(appData1);
        } else {
          appData1["appStatusCode"] = 1;
          appData1["message"] = ["Something went wrong"];
          appData1["data"] = [];
          appData1["error"] = [];
          res.send(appData1);
        }
      })
      .catch((err) => {
        appData1["appStatusCode"] = 2;
        appData1["message"] = "some error";
        appData1["data"] = [];
        appData1["error"] = err;
        res.send(appData1);
      });
  } catch (error) {
    appData1["appStatusCode"] = 2;
    appData1["message"] = "Something went wrong";
    appData1["data"] = [];
    appData1["error"] = error;

    res.send(appData1);
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    let userId = req.body.user_id;
    let _search = { n_Deleted: 1, user_id: userId };
    const result = req.body;
    // let temp_skip = ((result.n_skip) * result.n_limit);
    // let temp_limit = (result.n_skip + 1) * result.n_limit;

    User.aggregate([
      { $match: _search },
      //   {
      //     $lookup: {
      //       from: "projects",
      //       localField: 'customer_name',
      //       foreignField: "cust_name",
      //       as: "product",
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "inspections",
      //       localField: 'product.project_name',
      //       foreignField: "project_name",
      //       as: "second"
      //   },
      // },
      // { $unwind: "$product" },
      // { $match: { "product.n_Deleted": 1 } },
      // { "$match": { "Orders": [] }},
      {
        $group: {
          _id: "$_id",
          user_name: { $first: "$user_name" },
          first_name: { $first: "$first_name" },
          last_name: { $first: "$last_name" },
          user_id: { $first: "$user_id" },
          user_email: { $first: "$user_email" },
          n_Deleted: { $first: "$n_Deleted" },
          n_Status: { $first: "$n_Status" },
          // project_inspections: {$push: "$second"}
        },
      },
      { $sort: { user_name: 1 } },
      {
        $facet: {
          paginatedResults: [{ $skip: 0 }, { $limit: 10 }],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]).then(function (docs) {
      if (docs) {
        // docs[0].paginatedResults.map((data, i) => {
        //   let new_project = data.projects.flat(1);
        //   let new_inspection = data.project_inspections.flat(1);
        //   data.projects = new_project;
        //   data.project_inspections = new_inspection;
        //   data.total_projects = new_project.length;
        //   data.total_inspections = new_inspection.length;
        // });

        appData["appStatusCode"] = 0;
        appData["message"] = `Your requested user`;
        appData["data"] = docs;
        appData["error"] = [];
        res.send(appData);
      } else {
        appData["appStatusCode"] = 0;
        appData["message"] = ["Something went wrong"];
        appData["data"] = [];
        appData["error"] = [];
        res.send(appData);
      }
    });
  } catch (error) {
    appData["appStatusCode"] = 0;
    appData["message"] = "Something went wrong";
    appData["data"] = [];
    appData["error"] = error;

    res.send(appData);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = { user_id: req.params.id };
    const updatedData = req.body.updateUser;
    const options = { new: true };
    delete updatedData.password;
    delete updatedData.n_Deleted;

    const result = await User.findOneAndUpdate(id, updatedData, options);
    result.save(function (err, data) {
      if (err) {
        appData["appStatusCode"] = 2;
        appData["message"] = "some error";
        appData["data"] = [];
        appData["error"] = err.message;
        res.send(appData);
      } else {
        appData["appStatusCode"] = 0;
        appData["message"] = "Successfully Updated";
        appData["data"] = data;
        appData["error"] = [];
        res.send(appData);
      }
    });
    // }
  } catch (error) {
    appData["appStatusCode"] = 2;
    appData["message"] = "Something went wrong";
    appData["data"] = [];
    appData["error"] = error;
    res.send(appData);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.body.n_Deleted === 0 || req.body.n_Deleted === 1) {
      const singleUser = await User.findOne({ user_id: req.params.id });
      if (singleUser.n_Deleted == 0) {
        appData["appStatusCode"] = 1;
        appData["message"] = "Your user already deleted";
        appData["data"] = [];
        appData["error"] = [];

        res.send(appData);
      } else {
        const id = { user_id: req.params.id };
        const updatedData = { n_Deleted: req.body.n_Deleted };
        const options = { new: true };

        const removeData = await User.findOneAndUpdate(
          id,
          updatedData,
          options
        );
        if (removeData) {
          appData["appStatusCode"] = 0;
          appData["message"] = "Your user deleted";
          appData["data"] = removeData;
          appData["error"] = [];
        } else {
          appData["appStatusCode"] = 1;
          appData["message"] = "no user found for this ID";
          appData["data"] = [];
          appData["error"] = [];
        }
        res.send(appData);
      }
    } else {
      appData["appStatusCode"] = 1;
      appData["message"] = "Invalid code. The code should be 0 (or) 1";
      appData["data"] = [];
      appData["error"] = [];

      res.send(appData);
    }
  } catch (error) {
    appData["appStatusCode"] = 2;
    appData["message"] = "Sorry, Something went wrong";
    appData["data"] = [];
    appData["error"] = error;
    res.send(appData);
  }
};

exports.userStatus = async (req, res) => {
  try {
    if (req.body.n_Status === 0 || req.body.n_Status === 1) {
      const id = { user_id: req.params.id };
      const updatedData = { n_Status: req.body.n_Status };
      const options = { new: true };

      const removeData = await User.findOneAndUpdate(id, updatedData, options);
      if (removeData) {
        if (req.body.n_Status === 0) {
          appData["appStatusCode"] = 0;
          appData["message"] = "User Deactivated";
          appData["data"] = removeData;
          appData["error"] = [];
        } else {
          appData["appStatusCode"] = 0;
          appData["message"] = "User Activated";
          appData["data"] = removeData;
          appData["error"] = [];
        }
      } else {
        appData["appStatusCode"] = 0;
        appData["message"] = " Invalid Id (or) no user found for this ID";
        appData["data"] = [];
        appData["error"] = [];
      }
      res.send(appData);
    } else {
      appData["appStatusCode"] = 0;
      appData["message"] = "Invalid user status code";
      appData["data"] = [];
      appData["error"] = [];

      res.send(appData);
    }
  } catch (error) {
    appData["appStatusCode"] = 2;
    appData["message"] = "Sorry, Something went wrong";
    appData["data"] = [];
    appData["error"] = error;
    res.send(appData);
  }
};

exports.filterUser = async (req, res) => {
  try {
    const custStatus = req.body.customer_status;
    // const result = req.body;
    // let temp_skip = ((result.n_skip) * result.n_limit);
    // let temp_limit = (result.n_skip + 1) * result.n_limit;

    User.aggregate([
      { $match: { n_Deleted: 1, n_Status: { $eq: custStatus } } },
      // {
      //     $lookup: {
      //         from: "projects",
      //         localField: 'customer_name',
      //         foreignField: "cust_name",
      //         as: "project"
      //     }
      // },
      // {
      //   $lookup: {
      //     from: "inspections",
      //     localField: 'project.project_name',
      //     foreignField: "project_name",
      //     as: "second"
      // }
      // },

      // { $unwind: "$project" },
      // { $match: { "project.n_Deleted": 1 } },
      // { "$match": { "Orders": [] }},
      {
        $group: {
          _id: "$_id",
          user_name: { $first: "$user_name" },
          first_name: { $first: "$first_name" },
          last_name: { $first: "$last_name" },
          user_id: { $first: "$user_id" },
          user_email: { $first: "$user_email" },
          n_Deleted: { $first: "$n_Deleted" },
          n_Status: { $first: "$n_Status" },
          // project_inspections: {$push: "$second"}
        },
      },
      { $sort: { user_name: 1 } },
      {
        $facet: {
          paginatedResults: [{ $skip: 0 }, { $limit: 10 }],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ])
      .then(function (docs) {
        if (docs) {
          // docs[0].paginatedResults.map((data,i)=>{
          //     let new_projects = data.projects.flat(1);
          //     let new_inspections = data.project_inspections.flat(1);
          //     data.projects = new_projects;
          //     data.project_inspections = new_inspections;
          //     data.total_projects = new_projects.length;
          //     data.total_inspections = new_inspections.length;
          //   })

          appData1["appStatusCode"] = 0;
          appData["message"] = "Your filtered User";
          appData["data"] = docs;
          appData["error"] = [];
          res.send(appData);
        } else {
          appData1["appStatusCode"] = 2;
          appData["message"] = ["Something went wrong"];
          appData["data"] = [];
          appData["error"] = [];
          res.send(appData);
        }
      })
      .catch((err) => {
        appData1["appStatusCode"] = 2;
        appData["message"] = "some error";
        appData["data"] = [];
        appData["error"] = err;
        res.send(appData);
      });
  } catch (error) {
    appData["appStatusCode"] = 2;
    appData["message"] = "Something went wrong";
    appData["data"] = [];
    appData["error"] = error;

    res.send(appData);
  }
};

exports.logout = async (req, res) => {
  if (req) {
    appData["appStatusCode"] = 0;
    appData["message"] = "Logout Successfully";
    appData["payloadJson"] = [];
    appData["error"] = [];
    res.status(200).send(appData);
  }
};
