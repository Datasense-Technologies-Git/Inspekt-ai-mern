const dataSchema = require('../models/customers');
const shortid = require("shortid");

var appData = {
    status: "",
    appStatusCode: "",
    message: "",
    data: [],
    error: "",
};

const createCustomer = async (req, res) => {
    try {
        const userName = await dataSchema.findOne({ user_name: req.body.user_name });
        if (userName) {
            appData["status"] = 200;
            appData["appStatusCode"] = 2;
            appData["message"] = "This User already exist";
            appData["data"] = [];
            appData["error"] = [];
        }
        else {
            const userdata = new dataSchema({
                user_name: req.body.user_name,
                user_id: shortid.generate(),
                password: req.body.password,
                customer_name: req.body.customer_name,
                customer_email: req.body.customer_email,


            })

            if (user_name.length === 0) {
                appData["status"] = 200;
                appData["appStatusCode"] = 4;
                appData["message"] = "";
                appData["data"] = [];
                appData["error"] = "Username empty field";
            } else if (password.length === 0) {
                appData["status"] = 200;
                appData["appStatusCode"] = 4;
                appData["message"] = "";
                appData["data"] = [];
                appData["error"] = "Username empty field";
            } else if (customer_name.length === 0) {
                appData["status"] = 200;
                appData["appStatusCode"] = 4;
                appData["message"] = "";
                appData["data"] = [];
                appData["error"] = "Customer empty field";
            } else if (customer_email.length === 0) {
                appData["status"] = 200;
                appData["appStatusCode"] = 4;
                appData["message"] = "";
                appData["data"] = [];
                appData["error"] = "Customer email empty field";
            }
            else {

                userdata.save((error, user) => {
                    if (error) return res.status(400).json({ error });
                    if (user) {
                        appData["status"] = 200;
                        appData["appStatusCode"] = 0;
                        appData["message"] = "Your customer added Successfully";
                        appData['data'] = user;
                        appData["error"] = [];
                        return res.status(200).json({
                            appData
                        });
                    }
                });

                // const user = await userdata.save();



            }

        }

        res.json(appData);
    } catch (error) {
        appData["status"] = 200;
        appData["message"] = "Oops, Something went wrong !";
        appData['data'] = [];
        appData["error"] = [error];
        res.json(appData)
    }

}

const getAllCustomers = async (req, res) => {
    try {
        const allcustomers = await dataSchema.find({});
        appData["status"] = 200;
        appData["message"] = "Your all customers";
        appData['data'] = allcustomers;
        appData['error'] = [];
        res.json(appData);
    }
    catch (error) {
        appData["status"] = 200;
        appData["message"] = "Something went wrong";
        appData['data'] = allcustomers;
        appData['error'] = [];

        res.json(appData);
    }


}

const getSingleCustomer = async (req, res) => {
    try {
        const singleCustomer = await dataSchema.findOne({ customer_id: req.body.customer_id });
        if (singleCustomer) {

            appData["status"] = 200;
            appData["message"] = "Your selected customer";
            appData['data'] = [singleCustomer];
            appData['error'] = [];

            res.json(appData);
        }
        else {
            appData["status"] = 200;
            appData["message"] = "No results found (or) Invalid customer_id";
            appData['data'] = [];
            appData['error'] = [];

            res.json(appData);
        }

    }
    catch (error) {
        appData["status"] = 200;
        appData["message"] = "Something went wrong";
        appData['data'] = [];
        appData['error'] = [];

        res.json(appData);
    }
}

const updateCustomer = async (req, res) => {
    try {
        const id = { customer_id: req.params.id }
        const updatedData = req.body;
        const options = { new: true };

        const result = await dataSchema.findOneAndUpdate(
            id, updatedData, options
        );
        if (result) {
            const updateFiles = await result.save();
            appData["status"] = 200;
            appData["message"] = "Successfully Updated";
            appData['data'] = [updateFiles];
            appData['error'] = [];
        }
        else {
            appData["status"] = 200;
            appData["message"] = "not Successfully Updated";
            appData['data'] = [];
            appData['error'] = [];
        }


        res.json(appData);
    } catch (error) {
        appData["status"] = 200;
        appData["message"] = "Sorry, No results found";
        appData['data'] = [];
        appData['error'] = [error];
        res.json(appData);
    }
}

const deleteCustomer = async (req, res) => {
    try {
        const removeData = await dataSchema.findOneAndDelete({ customer_id: req.params.id });
        if (removeData) {
            appData["status"] = 200;
            appData["message"] = "Your customer deleted";
            appData['data'] = [removeData];
            appData['error'] = [];
        }
        else {
            appData["status"] = 200;
            appData["message"] = "Your customer not deleted";
            appData['data'] = [];
            appData['error'] = [];
        }
        res.json(appData);
    }
    catch (error) {
        appData["status"] = 200;
        appData["message"] = "Sorry, Something went wrong";
        appData['data'] = [];
        appData['error'] = [error];
        res.json(appData);
    }

}

const filterCustomer = async (req, res) => {
    try {
        const allcustomers = await dataSchema.find({});

        if (allcustomers.length > 0) {

            const filters = allcustomers.filter((data) => data.customer_name === req.body.customer_name);

            if (filters.length > 0) {

                appData["status"] = 200;
                appData["message"] = "Your filtered customer";
                appData['data'] = [filters];
                appData['error'] = [];

                res.json(appData);
            }
            else {

                appData["status"] = 200;
                appData["message"] = "No results found for your filter";
                appData['data'] = [];
                appData['error'] = [];

                res.json(appData);
            }
        }
        else {

            appData["status"] = 200;
            appData["message"] = "customers are empty";
            appData['data'] = [];
            appData['error'] = [];

            res.json(appData);
        }

    }
    catch (error) {

        appData["status"] = 200;
        appData["message"] = "Something went wrong";
        appData['data'] = [];
        appData['error'] = [];

        res.json(appData);
    }


}



module.exports = { createCustomer, getAllCustomers, getSingleCustomer, filterCustomer, updateCustomer, deleteCustomer }