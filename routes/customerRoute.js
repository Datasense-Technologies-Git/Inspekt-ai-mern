var express = require("express");
var router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const authenticator = require("../middleware/auth");
var customers = require("../controllers/customers");

// customer creating routes
router.post("/createCustomer",authenticator, customers.createCustomer);
// router.get("/customersList",authenticator, customers.getAllCustomers);
// router.post("/getSigleCustomer",authenticator, customers.getSingleCustomer);
// router.post("/customerByFilter",authenticator, customers.filterCustomer);
// router.delete("/deleteCustomer/:id",authenticator, customers.deleteCustomer);


module.exports = router;
