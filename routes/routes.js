var express = require("express");
var router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
var UserController = require("../controllers/user");
var InspectionController = require("../controllers/inspectionsController")
var projects = require("../controllers/projects")
const authenticator = require("../middleware/auth");
var customers = require("../controllers/customers");

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
router.delete("/deleteproject/:id",authenticator,projects.deleteProject);

// customer creating routes
router.post("/createCustomer",authenticator, customers.createCustomer);
router.get("/customersList",authenticator, customers.getAllCustomers);
router.post("/getSigleCustomer",authenticator, customers.getSingleCustomer);
router.post("/customerByFilter",authenticator, customers.filterCustomer);
router.delete("/deleteCustomer/:id",authenticator, customers.deleteCustomer);


module.exports = router;
