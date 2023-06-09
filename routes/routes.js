var express = require("express");
var router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
var UserController = require("../controllers/user");
var InspectionController = require("../controllers/inspectionsController")
var projects = require("../controllers/projects")
var inspection = require("../controllers/inspection");
var customers = require("../controllers/customers");
const authenticator = require("../middleware/auth");

// a simple test url to check that all of our files are communicating correctly.
router.get("/allregisterusers", UserController.allRegisterUsers);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/logout",authenticator,UserController.logout);

// router.post("/addInspections",authenticator,InspectionController.addInspections)
// router.get("/getAllInspections",authenticator,InspectionController.getAllInspections)

router.post("/createproject",authenticator,projects.createProject);
router.get("/allprojects",authenticator,projects.retriveAllProjects);
router.post("/singleproject",authenticator,projects.retriveSingleProject);
router.post("/filterproject",authenticator,projects.filterProject);
router.put("/updateproject/:id",authenticator,projects.updateProject);
router.put("/deleteproject/:id",authenticator,projects.deleteProject);
router.post("/searchproject",authenticator,projects.searchProject);

router.post("/createcustomer",authenticator, customers.createCustomer);
router.get("/allcustomers",authenticator, customers.getAllCustomers);
router.post("/singlecustomer",authenticator, customers.getSingleCustomer);
router.put("/updatecustomer/:id",authenticator, customers.updateCustomer);
router.put("/deletecustomer/:id",authenticator, customers.deleteCustomer);
router.put("/customerstatus/:id",authenticator, customers.customerStatus);
router.post("/searchcustomer",authenticator,customers.searchCustomer);
router.post("/filtercustomer",authenticator,customers.filterCustomer);

router.post("/addinspection",authenticator,inspection.addInspection)
router.get("/getallinspections",authenticator,inspection.getAllInspections)
router.post("/singleinspection",authenticator,inspection.getSingleInspection)
router.put("/deleteinspection/:id",authenticator,inspection.deleteInspection)
router.post("/searchinspection",authenticator,inspection.searchInspection)
router.post("/filterinspection",authenticator,inspection.filterInspection)
router.post("/updateinspection/:id",authenticator,inspection.updateInspection)

module.exports = router;
