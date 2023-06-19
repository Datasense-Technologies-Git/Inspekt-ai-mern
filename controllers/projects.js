const { Projects } = require("../models/projects");
const multer = require("multer");
const path = require("path");

var appData = {
  appStatusCode: 0,
  message: "",
  data: [],
  error: [],
};

const storage = multer.diskStorage({
  destination: "upload-images",
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname.replace(/\.[^/.]+$/, "") +
        "_" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

let maxSize = 2 * 1000 * 1000;

const upload = multer({
  storage: storage,
  limits: {
    fileSize: maxSize,
  },
  fileFilter: function (req, file, cb) {
    let fileTypes = /jpeg|jpg|png/;
    let mimeTypes = fileTypes.test(file.mimetype);
    let extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeTypes && extName) {
      return cb(null, true);
    }

    cb("File accepts only " + fileTypes);
  },
}).single("image");

const createProject = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      const checkProjectName = await Projects.findOne({
        project_name: req.body.project_name,
        n_Deleted: 1,
      });
      const checkProjectId = await Projects.findOne({
        project_id: req.body.project_id,
        n_Deleted: 1,
      });

      if (checkProjectName || checkProjectId) {
        appData["appStatusCode"] = 0;
        appData["message"] = "Project already exist";
        appData["data"] = [];
        appData["error"] = [];
        res.send(appData);
      } else if (!err) {
        const {
          project_name,
          project_id,
          cust_name,
          description,
          built_year,
          no_of_floors,
          street_1,
          street_2,
          city,
          zipcode,
          country,
          state,
        } = req.body;
        const userdata = new Projects({
          project_name,
          project_id,
          cust_name,
          description,
          built_year,
          no_of_floors,
          street_1,
          street_2,
          city,
          zipcode,
          country,
          state,
        });

        if (req.file) {
          userdata.image = req.file.path;
        }

        // if (
        //   userdata.project_id.length === 0 ||
        //   userdata.cust_name.length === 0 ||
        //   userdata.built_year.length === 0 ||
        //   userdata.no_of_floors.length === 0 ||
        //   userdata.street_1.length === 0 ||
        //   userdata.city.length === 0 ||
        //   userdata.zipcode.length === 0 ||
        //   userdata.country.length === 0 ||
        //   userdata.state.length === 0
        // ) {
        //
        //   appData["appStatusCode"] = 0;
        //   appData["message"] = "Please fill all the fields";
        //   appData["data"] = [];
        //   appData["error"] = [];
        //   res.send(appData);
        // } else {
        userdata.save(function (err, next) {
          if (err) {
            appData["appStatusCode"] = 2;
            appData["message"] = "some error";
            appData["data"] = [];
            appData["error"] = err.message;

            res.send(appData);
          } else {
            appData["appStatusCode"] = 0;
            appData["message"] = "Your project added Successfully";
            appData["data"] = next;
            appData["error"] = [];
            res.send(appData);
          }
        });
        // }
      } else {
        if (
          err instanceof multer.MulterError &&
          err.code === "LIMIT_FILE_SIZE"
        ) {
          appData["appStatusCode"] = 2;
          appData["message"] = "Received some error !";
          appData["data"] = [];
          appData["error"] = "File Size too large";
          res.send(appData);
        } else {
          appData["appStatusCode"] = 2;
          appData["message"] = "Received some error !";
          appData["data"] = [];
          appData["error"] = err;
          res.send(appData);
        }
      }
    });
  } catch (error) {
    appData["appStatusCode"] = 2;
    appData["message"] = "Oops, Something went wrong !";
    appData["data"] = [];
    appData["error"] = error;
    res.send(appData);
  }
};

const retriveAllProjects = async (req, res) => {
  try {
    const result = req.body;
    
    let _search =  { n_Deleted: 1 }
    if(result.searchTerm) {
      _search['$or'] = [
        { project_name: { $regex: result.searchTerm, $options: "i" } },
        { cust_name: { $regex: result.searchTerm, $options: "i" } },
        { street_1: { $regex: result.searchTerm, $options: "i" } },
        { city: { $regex: result.searchTerm, $options: "i" } },
        { state: { $regex: result.searchTerm, $options: "i" } },
        { country: { $regex: result.searchTerm, $options: "i" } }
      ]
    }
    if (result.country) {
      
    }

    Projects.aggregate([
      { $match: _search },
      {
        $lookup: {
          from: "inspections",
          localField: "project_name",
          foreignField: "project_name",
          as: "projects",
        },
      },
      // { $unwind: "$product" },
      // { $match: { "product.n_Deleted": 1 } },
      // { "$match": { "Orders": [] }},
      {
        $group: {
          _id: "$_id",
          project_name: { $first: "$project_name" },
          project_id: { $first: "$project_id" },
          cust_name: { $first: "$cust_name" },
          description: { $first: "$description" },
          built_year: { $first: "$built_year" },
          no_of_floors: { $first: "$no_of_floors" },
          street_1: { $first: "$street_1" },
          street_2: { $first: "$street_2" },
          city: { $first: "$city" },
          zipcode: { $first: "$zipcode" },
          country: { $first: "$country" },
          state: { $first: "$state" },
          n_Deleted: { $first: "$n_Deleted" },
          image: { $first: "$image" },
          // inspection :{$first:'$inspection'},
          project_inspection: { $push: "$projects" },
        },
      },
      { $sort: { project_name: 1 } },
      { $limit: result.n_limit },
      { $skip: result.n_skip },
    ]).then(function (docs) {
      if (docs) {
        docs.map((data, i) => {
          let a = data.project_inspection.flat(1);
          data.project_inspection = a;
          data.total_inspection = a.length;
        });

        appData["appStatusCode"] = 0;
        appData["message"] = `You have totally ${docs.length} projects`;
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
    appData["appStatusCode"] = 2;
    appData["message"] = "Something went wrong";
    appData["data"] = [];
    appData["error"] = error;

    res.send(appData);
  }
};

const retriveSingleProject = async (req, res) => {
  try {

    let projectID = req.body.project_id;

    let _search =  { n_Deleted: 1,project_id:projectID }

    Projects.aggregate([
      { $match: _search },
      {
        $lookup: {
          from: "inspections",
          localField: "project_name",
          foreignField: "project_name",
          as: "projects",
        },
      },
      // { $unwind: "$product" },
      // { $match: { "product.n_Deleted": 1 } },
      // { "$match": { "Orders": [] }},
      {
        $group: {
          _id: "$_id",
          project_name: { $first: "$project_name" },
          project_id: { $first: "$project_id" },
          cust_name: { $first: "$cust_name" },
          description: { $first: "$description" },
          built_year: { $first: "$built_year" },
          no_of_floors: { $first: "$no_of_floors" },
          street_1: { $first: "$street_1" },
          street_2: { $first: "$street_2" },
          city: { $first: "$city" },
          zipcode: { $first: "$zipcode" },
          country: { $first: "$country" },
          state: { $first: "$state" },
          n_Deleted: { $first: "$n_Deleted" },
          image: { $first: "$image" },
          // inspection :{$first:'$inspection'},
          project_inspection: { $push: "$projects" },
        },
      }
    ]).then(function (docs) {
      if (docs) {
        docs.map((data, i) => {
          let a = data.project_inspection.flat(1);
          data.project_inspection = a;
          data.total_inspection = a.length;
        });

        appData["appStatusCode"] = 0;
        appData["message"] = `You have totally ${docs.length} projects`;
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
  } 
  catch (error) {
    appData["appStatusCode"] = 2;
    appData["message"] = "Something went wrong";
    appData["data"] = [];
    appData["error"] = error;

    res.send(appData);
  }
};

const updateProject = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (!err) {
        const id = { project_id: req.params.id };
        const updatedData = req.body;
        const options = { new: true };
        delete updatedData.n_Deleted;
        if (req.file) {
          updatedData.image = req.file.path;
        }

        const result = await Projects.findOneAndUpdate(
          id,
          updatedData,
          options
        );

        if (result != null) {
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
        } else {
          appData["appStatusCode"] = 0;
          appData["message"] = "Invalid project id. Please check";
          appData["data"] = [];
          appData["error"] = [];
          res.send(appData);
        }
      } else {
        if (
          err instanceof multer.MulterError &&
          err.code === "LIMIT_FILE_SIZE"
        ) {
          appData["appStatusCode"] = 2;
          appData["message"] = "Received some error !";
          appData["data"] = [];
          appData["error"] = "File Size too large";
          res.send(appData);
        } else {
          appData["appStatusCode"] = 2;
          appData["message"] = "Received some error !";
          appData["data"] = [];
          appData["error"] = err;
          res.send(appData);
        }
      }
    });
  } catch (error) {
    appData["appStatusCode"] = 2;
    appData["message"] = "Something went wrong";
    appData["data"] = [];
    appData["error"] = error;
    res.send(appData);
  }
};

const deleteProject = async (req, res) => {
  try {
    if (req.body.n_Deleted === 0 || req.body.n_Deleted === 1) {
      const singleProject = await Projects.findOne({
        project_id: req.params.id,
      });
      if (singleProject.n_Deleted == 0) {
        appData["appStatusCode"] = 0;
        appData["message"] = "Your customer already deleted";
        appData["data"] = [];
        appData["error"] = [];

        res.send(appData);
      } else {
        const id = { project_id: req.params.id };
        const updatedData = { n_Deleted: req.body.n_Deleted };
        const options = { new: true };

        const removeData = await Projects.findOneAndUpdate(
          id,
          updatedData,
          options
        );
        if (removeData) {
          appData["appStatusCode"] = 0;
          appData["message"] = "Your Project deleted";
          appData["data"] = removeData;
          appData["error"] = [];
        } else {
          appData["appStatusCode"] = 0;
          appData["message"] =
            "Error while deleting. No project found for this ID";
          appData["data"] = [];
          appData["error"] = [];
        }
        res.send(appData);
      }
    } else {
      appData["appStatusCode"] = 0;
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

const filterProject = async (req, res) => {
  try {
    const countryNameList = req.body.country;
    const customerNameList = req.body.customer;

    if ( countryNameList.length > 0 && customerNameList.length > 0 ) {
      
      Projects.aggregate([
        { $match: { n_Deleted: 1, 
          $and: [
            {country: { $in: countryNameList }},
            {cust_name: { $in: customerNameList }},
          ]
          
        }
        },
        {
          $lookup: {
            from: "inspections",
            localField: "project_name",
            foreignField: "project_name",
            as: "projects",
          },
        },
        // { $unwind: "$product" },
        // { $match: { "product.n_Deleted": 1 } },
        // { "$match": { "Orders": [] }},
        {
          $group: {
            _id: "$_id",
            project_name: { $first: "$project_name" },
            project_id: { $first: "$project_id" },
            cust_name: { $first: "$cust_name" },
            description: { $first: "$description" },
            built_year: { $first: "$built_year" },
            no_of_floors: { $first: "$no_of_floors" },
            street_1: { $first: "$street_1" },
            street_2: { $first: "$street_2" },
            city: { $first: "$city" },
            zipcode: { $first: "$zipcode" },
            country: { $first: "$country" },
            state: { $first: "$state" },
            n_Deleted: { $first: "$n_Deleted" },
            image: { $first: "$image" },
            // inspection :{$first:'$inspection'},
            project_inspection: { $push: "$projects" },
          },
        },
      ]).then(function (docs) {
        if (docs) {
          docs.map((data, i) => {
            let a = data.project_inspection.flat(1);
            data.project_inspection = a;
            data.total_inspection = a.length;
          });
  
          appData["appStatusCode"] = 0;
          appData["message"] = `You have totally ${docs.length} projects`;
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
    }
    else{
      
      Projects.aggregate([
        { $match: { n_Deleted: 1, 
          $or: [
            {country: { $in: countryNameList }},
            {cust_name: { $in: customerNameList }},
          ]
          
        }
        },
        {
          $lookup: {
            from: "inspections",
            localField: "project_name",
            foreignField: "project_name",
            as: "projects",
          },
        },
        // { $unwind: "$product" },
        // { $match: { "product.n_Deleted": 1 } },
        // { "$match": { "Orders": [] }},
        {
          $group: {
            _id: "$_id",
            project_name: { $first: "$project_name" },
            project_id: { $first: "$project_id" },
            cust_name: { $first: "$cust_name" },
            description: { $first: "$description" },
            built_year: { $first: "$built_year" },
            no_of_floors: { $first: "$no_of_floors" },
            street_1: { $first: "$street_1" },
            street_2: { $first: "$street_2" },
            city: { $first: "$city" },
            zipcode: { $first: "$zipcode" },
            country: { $first: "$country" },
            state: { $first: "$state" },
            n_Deleted: { $first: "$n_Deleted" },
            image: { $first: "$image" },
            // inspection :{$first:'$inspection'},
            project_inspection: { $push: "$projects" },
          },
        },
      ]).then(function (docs) {
        if (docs) {
          docs.map((data, i) => {
            let a = data.project_inspection.flat(1);
            data.project_inspection = a;
            data.total_inspection = a.length;
          });
  
          appData["appStatusCode"] = 0;
          appData["message"] = `You have totally ${docs.length} projects`;
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
    }

    // if (countryNameList.length > 0) {

    //   const finalFilter = await Projects.find(
    //     { country: { $in: countryNameList } });

    //     if (finalFilter.length > 0) {

    //       appData["appStatusCode"] = 0;
    //       appData["message"] = "Your filtered results";
    //       appData["data"] = finalFilter;
    //       appData["error"] = [];

    //       res.send(appData);
    //     } else {

    //       appData["appStatusCode"] = 0;
    //       appData["message"] = "You don't have any projects for this filter";
    //       appData["data"] = [];
    //       appData["error"] = [];

    //       res.send(appData);
    //     }
    // }
    // else {

    //   appData["appStatusCode"] = 0;
    //   appData["message"] = "Please select atleast one project name";
    //   appData["data"] = [];
    //   appData["error"] = [];

    //   res.send(appData);
    // }
  } catch (error) {
    appData["appStatusCode"] = 2;
    appData["message"] = "Something went wrong";
    appData["data"] = [];
    appData["error"] = error;

    res.send(appData);
  }
};

const searchProject = async (req, res) => {
  try {
    const search = req.body.project_name;

    Projects.aggregate([
      {
        $match: {
          n_Deleted: 1,
          $or: [
            { project_name: { $regex: search, $options: "i" } },
            { cust_name: { $regex: search, $options: "i" } },
            { street_1: { $regex: search, $options: "i" } },
            { city: { $regex: search, $options: "i" } },
            { state: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } }
          ],
        },
      },
      // { $match: { n_Deleted:1,project_name: {$regex:search,$options:"i"},cust_name: {$regex:search,$options:"i"}} },
      {
        $lookup: {
          from: "inspections",
          localField: "project_name",
          foreignField: "project_name",
          as: "projects",
        },
      },
      // { $unwind: "$product" },
      // { $match: { "product.n_Deleted": 1 } },
      // { "$match": { "Orders": [] }},
      {
        $group: {
          _id: "$_id",
          project_name: { $first: "$project_name" },
          project_id: { $first: "$project_id" },
          cust_name: { $first: "$cust_name" },
          description: { $first: "$description" },
          built_year: { $first: "$built_year" },
          no_of_floors: { $first: "$no_of_floors" },
          street_1: { $first: "$street_1" },
          street_2: { $first: "$street_2" },
          city: { $first: "$city" },
          zipcode: { $first: "$zipcode" },
          country: { $first: "$country" },
          state: { $first: "$state" },
          n_Deleted: { $first: "$n_Deleted" },
          image: { $first: "$image" },
          // inspection :{$first:'$inspection'},
          project_inspection: { $push: "$projects" },
        },
      },
    ]).then(function (docs) {
      if (docs) {
        docs.map((data, i) => {
          let a = data.project_inspection.flat(1);
          data.project_inspection = a;
          data.total_inspection = a.length;
        });

        appData["appStatusCode"] = 0;
        appData["message"] = `You have totally ${docs.length} projects`;
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
    appData["appStatusCode"] = 2;
    appData["message"] = "Sorry, Something went wrong";
    appData["data"] = [];
    appData["error"] = error;
    res.send(appData);
  }
};

module.exports = {
  createProject,
  retriveAllProjects,
  retriveSingleProject,
  filterProject,
  updateProject,
  deleteProject,
  searchProject,
};
