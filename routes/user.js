var express = require("express");
var router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
var UserController = require("../controllers/user");
var projects = require("../controllers/projects")
const authenticator = require("../middleware/auth");

// a simple test url to check that all of our files are communicating correctly.
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/logout",authenticator,UserController.logout);


router.post("/createproject",projects.createProject);
router.get("/allprojects",projects.retriveAllProjects);
router.post("/singleproject",projects.retriveSingleProject);
router.post("/filterproject",projects.filterProject);


module.exports = router;
