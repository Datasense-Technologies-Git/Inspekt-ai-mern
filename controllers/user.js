const {User} = require('../models/user');
const datalize = require('datalize');
const field = datalize.field;

var appData = {
    "status" : 0,
    "message" : "",
    "data" : [],
    "error" : []
}

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test!');
};

exports.checkUser = function (req, res) {
    const data = req.body;
    const errors = {};
    if (!(/^(?=.*[A-Za-z]).{3,}$/).test(String(data.c_Name).trim())) {
        errors.c_Name = ['Name is not valid'];
    } 
    // /^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/
    // if (!(/^[6789]\d{9}$/).test(String(data.n_Mobile).trim())) {
    //     errors.n_Mobile = ['Mobile number is not valid.'];
    // }

    if(Object.keys(errors).length>0)
    {
        appData["status"] = 0
        appData["message"] = ""
        appData["data"] = []
        appData["error"] = errors
        res.send(appData)
    }
    else
    {

        try {
            var insertUser = new User(data);
            insertUser.save(function (err,next) {
                if(err) {
                    appData["status"] = 0
                    appData["message"] = ""
                    appData["data"] = []
                    // if (err.name === "ValidationError") {
                    let errors = {};
                    Object.keys(err.errors).forEach((key) => {
                    errors[key] = err.errors[key].message;
                    });
                    appData["error"] = errors
                    // appData["errors"] = errors
                    res.send(appData)
                } else {
                    appData["status"] = 1
                    appData["message"] = "_User Created successfully"
                    appData["data"] = next
                    appData["error"] = []
                    res.send(appData)
                }
            });
        } catch (err) {
            // console.error(err);
            appData["status"] = 0
            appData["message"] = "Getting an error"
            appData["data"] = err
            appData["error"] = []
            res.send(appData)
        }
        // var insertUser = new User(data);
        // insertUser.save(function (err,next) {
        //     try {
                

        //     } catch (err) {    
               
        //     }
        // })
    }
};
