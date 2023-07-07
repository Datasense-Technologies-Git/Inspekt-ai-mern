var express = require("express");
var router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
var UserController = require("../controllers/user");
var InspectionController = require("../controllers/inspectionsController")
var projects = require("../controllers/projects")
var inspection = require("../controllers/inspection");
var customers = require("../controllers/customers");
var countries = require("../controllers/countrylist");
const authenticator = require("../middleware/auth");

// a simple test url to check that all of our files are communicating correctly.

// router.post("/register", UserController.register);
router.post("/login", UserController.logIn1);
router.get("/logout",authenticator,UserController.logout);

// router.post("/addInspections",authenticator,InspectionController.addInspections)
// router.get("/getAllInspections",authenticator,InspectionController.getAllInspections)

router.post("/createproject",authenticator,projects.createProject);
router.post("/allprojects",authenticator,projects.retriveAllProjects);
router.post("/singleproject",authenticator,projects.retriveSingleProject);
router.post("/filterproject",authenticator,projects.filterProject);
router.put("/updateproject/:id",authenticator,projects.updateProject);
router.put("/deleteproject/:id",authenticator,projects.deleteProject);
router.post("/searchproject",authenticator,projects.searchProject);
router.post("/singlecustomerprojects",authenticator,projects.singleCustomerProjects);

router.post("/createcustomer",authenticator, customers.createCustomer);
router.post("/allcustomers",authenticator, customers.getAllCustomers);
router.post("/singlecustomer",authenticator, customers.getSingleCustomer);
router.put("/updatecustomer/:id",authenticator, customers.updateCustomer);
router.put("/deletecustomer/:id",authenticator, customers.deleteCustomer);
router.put("/customerstatus/:id",authenticator, customers.customerStatus);
router.post("/searchcustomer",authenticator,customers.searchCustomer);
router.post("/filtercustomer",authenticator,customers.filterCustomer);

router.post("/addinspection",authenticator,inspection.addInspection)
router.post("/getallinspections",authenticator,inspection.getAllInspections)
router.post("/singleinspection",authenticator,inspection.getSingleInspection)
router.put("/deleteinspection/:id",authenticator,inspection.deleteInspection)
router.post("/searchinspection",authenticator,inspection.searchInspection)
router.post("/filterinspection",authenticator,inspection.filterInspection)
router.put("/updateinspection/:id",authenticator,inspection.updateInspection)
router.post("/singleprojectinspections",authenticator,inspection.singleProjectInspections)

router.post("/countrylist",authenticator,countries.countryList  )

router.post("/createuser", UserController.createUser);
router.post("/allregisterusers", UserController.allRegisterUsers);
router.post("/singleuser", UserController.getSingleUser);
router.put("/updateuser/:id",UserController.updateUser );
router.put("/deleteuser/:id", UserController.deleteUser);
router.put("/userstatus/:id", UserController.userStatus);
router.post("/filteruser",UserController.filterUser);

module.exports = router;
