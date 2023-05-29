var express = require("express");
var router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
var UserController = require("../controllers/user");
var InspectionController = require("../controllers/inspectionsController")
var projects = require("../controllers/projects")
var customers = require("../controllers/customers");
const authenticator = require("../middleware/auth");

// a simple test url to check that all of our files are communicating correctly.
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/logout",authenticator,UserController.logout);

router.post("/addInspections",authenticator,InspectionController.addInspections)
router.get("/getAllInspections",authenticator,InspectionController.getAllInspections)

router.post("/createproject",authenticator,projects.createProject);
router.get("/allprojects",authenticator,projects.retriveAllProjects);
router.post("/singleproject",authenticator,projects.retriveSingleProject);
router.post("/filterproject",authenticator,projects.filterProject);
router.put("/updateproject/:id",authenticator,projects.updateProject);
router.put("/deleteproject/:id",authenticator,projects.deleteProject);
router.post("/searchproject",authenticator,projects.searchProject);

router.post("/createCustomer",authenticator, customers.createCustomer);

module.exports = router;