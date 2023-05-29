const dataSchema = require("../models/projects");
const multer = require("multer");
const path = require("path");

var appData = {
  status: 0,
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
      const checkProjectName = await dataSchema.findOne({
        project_name: req.body.project_name,
      });
      const checkProjectId = await dataSchema.findOne({
        project_id: req.body.project_id,
      });

      if (checkProjectName || checkProjectId) {
        appData["status"] = 200;
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
        const userdata = new dataSchema({
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

        if (
          userdata.project_id.length === 0 ||
          userdata.cust_name.length === 0 ||
          userdata.built_year.length === 0 ||
          userdata.no_of_floors.length === 0 ||
          userdata.street_1.length === 0 ||
          userdata.city.length === 0 ||
          userdata.zipcode.length === 0 ||
          userdata.country.length === 0 ||
          userdata.state.length === 0
        ) {
          appData["status"] = 200;
          appData["appStatusCode"] = 0;
          appData["message"] = "Please fill all the fields";
          appData["data"] = [];
          appData["error"] = [];
          res.send(appData);
        } else {
          userdata.save(function (err, next) {
            if (err) {
              appData["status"] = 400;
              appData["appStatusCode"] = 2;
              appData["message"] = "some error";
              appData["data"] = [];
              appData["error"] = err.message;
              res.send(appData);
            } else {
              appData["status"] = 200;
              appData["appStatusCode"] = 0;
              appData["message"] = "Your project added Successfully";
              appData["data"] = next;
              appData["error"] = [];
              res.send(appData);
            }
          });
        }
      } else {
        appData["status"] = 404;
        appData["appStatusCode"] = 2;
        appData["message"] = "Received some error !";
        appData["data"] = [];
        appData["error"] = err;
      }
      // res.json(appData);
    });
  } catch (error) {
    appData["status"] = 404;
    appData["appStatusCode"] = 2;
    appData["message"] = "Oops, Something went wrong !";
    appData["data"] = [];
    appData["error"] = error;
    res.json(appData);
  }
};

const retriveAllProjects = async (req, res) => {
  try {
    const allprojects = await dataSchema.find({});
    if (allprojects.length > 0) {
      appData["status"] = 200;
      appData["appStatusCode"] = 0;
      appData["message"] = `You have totally ${allprojects.length} projects`;
      appData["data"] = allprojects;
      appData["error"] = [];
      res.json(appData);
    } else {
      appData["status"] = 200;
      appData["appStatusCode"] = 0;
      appData["message"] = "Currently you don't have any projects";
      appData["data"] = allprojects;
      appData["error"] = [];
      res.json(appData);
    }
  } catch (error) {
    appData["status"] = 404;
    appData["appStatusCode"] = 2;
    appData["message"] = "Something went wrong";
    appData["data"] = [];
    appData["error"] = error;

    res.json(appData);
  }
};

const retriveSingleProject = async (req, res) => {
  try {
    const singleproject = await dataSchema.findOne({
      project_id: req.body.project_id,
    });
    if (singleproject) {
      appData["status"] = 200;
      appData["appStatusCode"] = 0;
      appData["message"] = "Your selected project";
      appData["data"] = singleproject;
      appData["error"] = [];

      res.json(appData);
    } else {
      appData["status"] = 200;
      appData["appStatusCode"] = 0;
      appData["message"] = "No results found (or) Invalid project_id";
      appData["data"] = [];
      appData["error"] = [];

      res.json(appData);
    }
  } catch (error) {
    appData["status"] = 404;
    appData["appStatusCode"] = 2;
    appData["message"] = "Something went wrong";
    appData["data"] = [];
    appData["error"] = error;

    res.json(appData);
  }
};

const updateProject = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      const id = { project_id: req.params.id };
      const updatedData = req.body;
      const options = { new: true, useFindAndModify: false };

      if (req.file) {
        updatedData.image = req.file.path;
      }
      const result = await dataSchema.findOneAndUpdate(
        id,
        updatedData,
        options
      );

      await result.save(function (err, next) {
        if (err) {
          appData["status"] = 400;
          appData["appStatusCode"] = 2;
          appData["message"] = "some error";
          appData["data"] = [];
          appData["error"] = err.message;
          res.send(appData);
        } else {
          appData["status"] = 200;
          appData["appStatusCode"] = 0;
          appData["message"] = "Successfully Updated";
          appData["data"] = next;
          appData["error"] = [];
          res.send(appData);
        }
      });
    });
  } catch (error) {
    appData["status"] = 404;
    appData["appStatusCode"] = 2;
    appData["message"] = "Something went wrong";
    appData["data"] = [];
    appData["error"] = error;
    res.json(appData);
  }
};

const deleteProject = async (req, res) => {
  try {
    // const removeData = await dataSchema.findOneAndDelete({
    //   project_id: req.params.id,
    // });
    const id = { project_id: req.params.id };
    const updatedData = { n_Deleted: req.body.n_Deleted };
    const options = { new: true };

    const removeData = await dataSchema.findOneAndUpdate(
      id,
      updatedData,
      options
    );
    if (removeData) {
      appData["status"] = 200;
      appData["appStatusCode"] = 0;
      appData["message"] = "Your Project deleted";
      appData["data"] = removeData;
      appData["error"] = [];
    } else {
      appData["status"] = 200;
      appData["appStatusCode"] = 0;
      appData["message"] = "no projects found for this ID";
      appData["data"] = [];
      appData["error"] = [];
    }
    res.json(appData);
  } catch (error) {
    appData["status"] = 404;
    appData["appStatusCode"] = 2;
    appData["message"] = "Sorry, Something went wrong";
    appData["data"] = [];
    appData["error"] = error;
    res.json(appData);
  }
};

const filterProject = async (req, res) => {
  try {
    const allprojects = await dataSchema.find({});
    const projectNameList = req.body.project_name;

    if (allprojects.length > 0) {
      if (projectNameList.length > 0) {
        let filteredAns = [];
        projectNameList.map((p_name, index) => {
          const filters = allprojects.filter((data) => {
            if (data.project_name === p_name) {
              filteredAns.push(data);
            }
          });
        });
        if (filteredAns.length > 0) {
          appData["status"] = 200;
        appData["appStatusCode"] = 0;
        appData["message"] = "Your filtered results";
        appData["data"] = filteredAns;
        appData["error"] = [];

        res.json(appData);
        } else {
          appData["status"] = 200;
        appData["appStatusCode"] = 0;
        appData["message"] = "You don't have any projects for this filter";
        appData["data"] = [];
        appData["error"] = [];

        res.json(appData);
        }
      } else {
        appData["status"] = 200;
        appData["appStatusCode"] = 0;
        appData["message"] = "Please select atleast one project name";
        appData["data"] = [];
        appData["error"] = [];

        res.json(appData);
      }
    } else {
      appData["status"] = 200;
      appData["appStatusCode"] = 0;
      appData["message"] = "Your projects are empty";
      appData["data"] = [];
      appData["error"] = [];

      res.json(appData);
    }
  } catch (error) {
    appData["status"] = 404;
    appData["appStatusCode"] = 2;
    appData["message"] = "Something went wrong";
    appData["data"] = [];
    appData["error"] = error;

    res.json(appData);
  }
};

const searchProject = async (req, res) => {
  try {
    const search = req.body.project_name;
    if (search.length >= 3) {
      const searchAnswers = await dataSchema.find({ project_name: { $regex: search, $options: "i" } })
    
    if (searchAnswers.length > 0) {
      appData["status"] = 200;
    appData["appStatusCode"] = 0;
    appData["message"] = "Your search results are below";
    appData["data"] = searchAnswers;
    appData["error"] = [];

    res.json(appData);
    } else {
      appData["status"] = 200;
    appData["appStatusCode"] = 0;
    appData["message"] = "No projects found for your search";
    appData["data"] = [];
    appData["error"] = [];

    res.json(appData);
    }
    } else {
      appData["status"] = 200;
    appData["appStatusCode"] = 0;
    appData["message"] = "Min 3 characters required for your search";
    appData["data"] = [];
    appData["error"] = [];

    res.json(appData);
    }
    
  } catch (error) {
    appData["status"] = 404;
    appData["appStatusCode"] = 2;
    appData["message"] = "Sorry, Something went wrong";
    appData["data"] = [];
    appData["error"] = error;
    res.json(appData);
  }
};

module.exports = {
  createProject,
  retriveAllProjects,
  retriveSingleProject,
  filterProject,
  updateProject,
  deleteProject,
  searchProject
};
