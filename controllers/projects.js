const {Projects} = require("../models/projects");
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
        project_name: req.body.project_name,n_Deleted :1
      });
      const checkProjectId = await Projects.findOne({
        project_id: req.body.project_id,n_Deleted :1
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
    Projects.aggregate(
      [
          { $match: { n_Deleted:1} },
          {
              $lookup: {
                  from: "inspections",
                  localField: 'project_name',
                  foreignField: "project_name",
                  as: "inspection"
              }
          },
          // { $unwind: "$product" },
          // { $match: { "product.n_Deleted": 1 } },
          // { "$match": { "Orders": [] }},
          {$group: {
              _id: "$_id",
              project_name: { $first: '$project_name'},
              project_id: { $first: '$project_id'},
              cust_name: { $first: '$cust_name'},
              built_year: { $first: '$built_year'},
              no_of_floors: { $first: '$no_of_floors'},
              street_1: { $first: '$street_1'},
              street_2: { $first: '$street_2'},
              city: { $first: '$city'},
              zipcode: { $first: '$zipcode'},
              country: { $first: '$country'},
              state: { $first: '$state'},
              n_Deleted: { $first: '$n_Deleted'},
              image: { $first: '$image'},
              // inspection :{$first:'$inspection'},
              project_inspection: {$push: "$inspection"}
          }}

      ]).then(function(docs) 
      {
          if(docs)
          {
            console.log(docs ,"-------");
            docs.map((data,i)=>{
              let a = data.project_inspection.flat(1);
              data.project_inspection = a;
              // data.inspection = a;
              data.total_inspection = a.length;
           })

           appData["appStatusCode"] = 0;
              appData["message"] = `You have totally ${docs.length} projects`;
              appData["data"] = docs
              appData["error"] = []
              res.send(appData) 
          } else {
            appData["appStatusCode"] = 0;
              appData["message"] = ["Something went wrong"]
              appData["data"] = []
              appData["error"] = []
              res.send(appData)  
          } 
      })

    // const allprojects = await Projects.find({});
    // if (allprojects.length > 0) {
    //   
    //   appData["appStatusCode"] = 0;
    //   appData["message"] = `You have totally ${allprojects.length} projects`;
    //   appData["data"] = allprojects;
    //   appData["error"] = [];
    //   res.send(appData);
    // } else {
    //   
    //   appData["appStatusCode"] = 0;
    //   appData["message"] = "Currently you don't have any projects";
    //   appData["data"] = allprojects;
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

const retriveSingleProject = async (req, res) => {
  try {
    const singleproject = await Projects.findOne({
      project_id: req.body.project_id,
    });
    
    if (singleproject) {
      
      appData["appStatusCode"] = 0;
      appData["message"] = "Your selected project";
      appData["data"] = [singleproject];
      appData["error"] = [];

      res.send(appData);
    } else {
      
      appData["appStatusCode"] = 0;
      appData["message"] = "No project found (or) Invalid project_id";
      appData["data"] = [];
      appData["error"] = [];

      res.send(appData);
    }
  } catch (error) {
    
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
      delete updatedData.n_Status; 
      delete updatedData.n_Deleted;
      if (req.file) {
        updatedData.image = req.file.path;
      }
      console.log(updatedData ,'------ updatedData');
      const result = await Projects.findOneAndUpdate(
        id,
        updatedData,
        options
      );
      
     
      if (result != null) {
        result.save(function (err, data) {
          if (err) {
            console.log(err ,'------------');
            
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
    console.log('----------- 2');
    
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
      const singleProject = await Projects.findOne({ project_id: req.params.id });
          if(singleProject.n_Deleted == 0){
            
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
      appData["message"] = "Error while deleting. No project found for this ID";
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

    if (countryNameList.length > 0) {
      
      const finalFilter = await Projects.find(
        { country: { $in: countryNameList } });
        

        if (finalFilter.length > 0) {
          
          appData["appStatusCode"] = 0;
          appData["message"] = "Your filtered results";
          appData["data"] = finalFilter;
          appData["error"] = [];

          res.send(appData);
        } else {
          
          appData["appStatusCode"] = 0;
          appData["message"] = "You don't have any projects for this filter";
          appData["data"] = [];
          appData["error"] = [];

          res.send(appData);
        }
    }
    else {
      
      appData["appStatusCode"] = 0;
      appData["message"] = "Please select atleast one project name";
      appData["data"] = [];
      appData["error"] = [];

      res.send(appData);
    }
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
    if (search.length >= 3) {
      const searchAnswers = await Projects.find({
        project_name: { $regex: search, $options: "i" },
      });

      if (searchAnswers.length > 0) {
        
        appData["appStatusCode"] = 0;
        appData["message"] = "Your search results are below";
        appData["data"] = searchAnswers;
        appData["error"] = [];

        res.send(appData);
      } else {
        
        appData["appStatusCode"] = 0;
        appData["message"] = "No projects found for your search";
        appData["data"] = [];
        appData["error"] = [];

        res.send(appData);
      }
    } else {
      
      appData["appStatusCode"] = 0;
      appData["message"] = "Min 3 characters required for your search";
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

module.exports = {
  createProject,
  retriveAllProjects,
  retriveSingleProject,
  filterProject,
  updateProject,
  deleteProject,
  searchProject,
};
