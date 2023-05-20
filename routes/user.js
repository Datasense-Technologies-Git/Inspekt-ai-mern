var express = require("express");
var router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
var UserController = require("../controllers/user");
const authenticator = require("../middleware/auth");

// a simple test url to check that all of our files are communicating correctly.
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/logout",authenticator,UserController.logout)


module.exports = router;
