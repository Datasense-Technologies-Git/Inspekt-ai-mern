var express = require('express');
var router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
var UserController = require('../controllers/user');


// a simple test url to check that all of our files are communicating correctly.
router.get('/test', UserController.test);


router.post('/checkUser', UserController.checkUser);

// router.get('/view', UserController.user_details);

// router.post('/update', UserController.user_update);

// // router.post('/:id/update', UserController.user_update);

// // router.delete('/:id/delete', UserController.user_delete);

// router.get('/getwhere', UserController.user_getwhere_details);

// router.post('/check', UserController.user_getwhere);

// router.post('/history', UserController.user_history_create);

// router.post('/login', UserController.user_login);

// router.post('/UserPaginate', UserController.UserPaginate);

// // 10-12-2020
// // **********************************************
// router.post('/create_pay', UserController.userPay_create);
// // Update User Pay Details
// router.post('/update_pay', UserController.userPay_update);
// // User Pay View
// router.post('/view_userPay', UserController.userPay_view);
// // User Pay Count
// router.post('/count_userPay', UserController.userPay_count);

// // 09-01-2021
// // **********************************************
// // Create User Bank Details
// router.post('/create_bankDetails', UserController.userBank_create);
// // Update User Bank Details
// router.post('/update_bankDetails', UserController.userBank_update);
// // User Bank View
// router.post('/view_bankDetails', UserController.userBank_view);
// // User Bank Count
// router.post('/count_bankDetails', UserController.userBank_count);

module.exports = router;