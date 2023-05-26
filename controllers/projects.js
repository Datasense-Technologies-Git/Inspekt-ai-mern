const dataSchema = require("../models/projects");
const multer = require("multer");

var appData = {
  status: 0,
  message: "",
  data: [],
  error: [],
};

const storage = multer.diskStorage({
  destination: "newuploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
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
        appData["message"] = "Project already exist";
        appData["data"] = [];
        appData["error"] = [];
      } else if (!err) {
        const userdata = new dataSchema({
          project_name: req.body.project_name,
          project_id: req.body.project_id,
          cust_name: req.body.cust_name,
          image: {
            data: req.file.filename,
            contentType: "image/png",
          },
          description: req.body.description,
          built_year: req.body.built_year,
          no_of_floors: req.body.no_of_floors,
          street_1: req.body.street_1,
          street_2: req.body.street_2,
          city: req.body.city,
          zipcode: req.body.zipcode,
          country: req.body.country,
          state: req.body.state,
        });

        if (userdata.project_name.length === 0 || userdata.project_id.length === 0 || userdata.cust_name.length === 0 ||  userdata.built_year.length === 0 || userdata.no_of_floors.length === 0 || userdata.street_1.length === 0 || userdata.city.length === 0 || userdata.zipcode.length === 0 || userdata.country.length === 0 || userdata.state.length === 0) {
            appData["status"] = 200;
            appData["message"] = "Please fill all the fields";
            appData["data"] = [];
            appData["error"] = [];
        }
        else {
        const user = await userdata.save();
        appData["status"] = 200;
        appData["message"] = "Your project added Successfully";
        appData["data"] = [user];
        appData["error"] = [];

        }
      } else {
        appData["status"] = 200;
        appData["message"] = "Received some error !";
        appData["data"] = user;
        appData["error"] = [err];
      }
      res.json(appData);
    });
  } catch (error) {
    appData["status"] = 200;
    appData["message"] = "Oops, Something went wrong !";
    appData["data"] = [];
    appData["error"] = [error];
    res.json(appData);
  }
};

const retriveAllProjects = async (req, res) => {
  try {
    const allprojects = await dataSchema.find({});
    if (allprojects.length > 0) {
      appData["status"] = 200;
      appData["message"] = "Your all projects";
      appData["data"] = allprojects;
      appData["error"] = [];
      res.json(appData);
    } else {
      appData["status"] = 200;
      appData["message"] = "Currently you don't have any projects";
      appData["data"] = allprojects;
      appData["error"] = [];
      res.json(appData);
    }
  } catch (error) {
    appData["status"] = 200;
    appData["message"] = "Something went wrong";
    appData["data"] = allprojects;
    appData["error"] = [];

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
      appData["message"] = "Your selected project";
      appData["data"] = [singleproject];
      appData["error"] = [];

      res.json(appData);
    } else {
      appData["status"] = 200;
      appData["message"] = "No results found (or) Invalid project_id";
      appData["data"] = [];
      appData["error"] = [];

      res.json(appData);
    }
  } catch (error) {
    appData["status"] = 200;
    appData["message"] = "Something went wrong";
    appData["data"] = [];
    appData["error"] = [];

    res.json(appData);
  }
};

const updateProject = async (req, res) => {
  try {
    const id = { project_id: req.params.id };
    const updatedData = req.body;
    const options = { new: true };

    const result = await dataSchema.findOneAndUpdate(id, updatedData, options);
    if (result) {
      const updateFiles = await result.save();
      appData["status"] = 200;
      appData["message"] = "Successfully Updated";
      appData["data"] = [updateFiles];
      appData["error"] = [];
    } else {
      appData["status"] = 200;
      appData["message"] = "not Successfully Updated";
      appData["data"] = [];
      appData["error"] = [];
    }

    res.json(appData);
  } catch (error) {
    appData["status"] = 200;
    appData["message"] = "Sorry, No results found";
    appData["data"] = [];
    appData["error"] = [error];
    res.json(appData);
  }
};

const deleteProject = async (req, res) => {
  try {
    const removeData = await dataSchema.findOneAndDelete({
      project_id: req.params.id,
    });
    if (removeData) {
      appData["status"] = 200;
      appData["message"] = "Your Project deleted";
      appData["data"] = [removeData];
      appData["error"] = [];
    } else {
      appData["status"] = 200;
      appData["message"] = "Your project not deleted";
      appData["data"] = [];
      appData["error"] = [];
    }
    res.json(appData);
  } catch (error) {
    appData["status"] = 200;
    appData["message"] = "Sorry, Something went wrong";
    appData["data"] = [];
    appData["error"] = [error];
    res.json(appData);
  }
};

const filterProject = async (req, res) => {
  try {
    const allprojects = await dataSchema.find({});

    if (allprojects.length > 0) {
      const filters = allprojects.filter(
        (data) => data.project_name === req.body.project_name
      );

      if (filters.length > 0) {
        appData["status"] = 200;
        appData["message"] = "Your filtered project";
        appData["data"] = [filters];
        appData["error"] = [];

        res.json(appData);
      } else {
        appData["status"] = 200;
        appData["message"] = "No results found for your filter";
        appData["data"] = [];
        appData["error"] = [];

        res.json(appData);
      }
    } else {
      appData["status"] = 200;
      appData["message"] = "projects are empty";
      appData["data"] = [];
      appData["error"] = [];

      res.json(appData);
    }
  } catch (error) {
    appData["status"] = 200;
    appData["message"] = "Something went wrong";
    appData["data"] = [];
    appData["error"] = [];

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
};
