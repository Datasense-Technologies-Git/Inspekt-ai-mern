var express = require("express");
var router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
var UserController = require("../controllers/user");

// a simple test url to check that all of our files are communicating correctly.
router.get("/test", UserController.test);

router.post("/checkUser", UserController.checkUser);
router.post("/register", UserController.register);

module.exports = router;
