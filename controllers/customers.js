const customerSchema = require('../models/customers');
const shortid = require("shortid");
const bcrypt = require("bcryptjs");

var appData = {
    status: "",
    appStatusCode: "",
    message: "",                                                                               
    data: [],
    error: "",
};

const createCustomer = async (req, res) => {
    try {
        const checkUserName = await customerSchema.findOne({
            user_name: req.body.user_name,
          });
          const checkCustomerName = await customerSchema.findOne({
            customer_name: req.body.customer_name,
          });
          const checkEmail = await customerSchema.findOne({
            customer_email: req.body.customer_email,
          });

          if (checkUserName || checkCustomerName || checkEmail) {
            appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = "Please check. Customer name or User name or email already exist";
            appData["data"] = [];
            appData["error"] = [];
            res.send(appData);
          } 
          else{
            const {
                user_name,
                customer_name,
                customer_email,
                password,
              } = req.body;
              const hashPass = await bcrypt.hash(password,7);
              const userdata = new customerSchema({
                user_name,
                customer_id: shortid.generate(),
                customer_name,
                customer_email,
                password:hashPass
              });

              userdata.save(function (err, data) {
                if (err) {
                  appData["status"] = 400;
                  appData["appStatusCode"] = 2;
                  appData["message"] = "some error";
                  appData["data"] = [];
                  appData["error"] = err.message;
    
                  res.send(appData);
                } else {
                  appData["status"] = 200;
                  appData["appStatusCode"] = 0;
                  appData["message"] = "Customer added Successfully";
                  appData["data"] = data;
                  appData["error"] = [];
                  res.send(appData);
                }
              });
          }
    } catch (error) {
        appData["status"] = 404;
        appData["appStatusCode"] = 2;
        appData["message"] = "Oopsss, Something went wrong !";
        appData['data'] = [];
        appData["error"] = error;
        res.json(appData)
    }

}

const getAllCustomers = async (req, res) => {
    try {
        const allcustomers = await customerSchema.find({});
        if (allcustomers.length > 0) {
            appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = `You have totally ${allcustomers.length} customers`;
            appData["data"] = allcustomers;
            appData["error"] = [];
            res.json(appData);
          } else {
            appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = "Currently you don't have any customers";
            appData["data"] = allcustomers;
            appData["error"] = [];
            res.json(appData);
          }
        } catch (error) {
          appData["status"] = 404;
          appData["appStatusCode"] = 2;
          appData["message"] = "Something went wrong";
          appData["data"] = [];
          appData["error"] = error;
      
          res.json(appData);
        }
}

const getSingleCustomer = async (req, res) => {
    try {
        const singleCustomer = await customerSchema.findOne({ customer_id: req.body.customer_id });
        if (singleCustomer) {

            appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = "Your selected customer";
            appData['data'] = singleCustomer;
            appData['error'] = [];

            res.json(appData);
        }
        else {
            appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = "No results found (or) Invalid customer_id";
            appData['data'] = [];
            appData['error'] = [];

            res.json(appData);
        }

    }
    catch (error) {
        appData["status"] = 404;
        appData["appStatusCode"] = 0;
        appData["message"] = "Something went wrong";
        appData['data'] = [];
        appData['error'] = error;

        res.json(appData);
    }
}

const updateCustomer = async (req, res) => {
    try {
        const id = {customer_id:req.params.id}
        const updatedData = req.body;
        const options = { new: true };
        delete updatedData.password; 

        const checkUserName = await customerSchema.findOne({
            user_name: updatedData.user_name,
          });
          const checkCustomerName = await customerSchema.findOne({
            customer_name: updatedData.customer_name,
          });
          const checkEmail = await customerSchema.findOne({
            customer_email: updatedData.customer_email,
          });
          if (checkUserName) {
            appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = "Sorry.. Username already exist";
            appData["data"] = [];
            appData["error"] = [];
            res.send(appData);
          } 
          else if (checkCustomerName) {
            appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = "Sorry.. Customer name already exist";
            appData["data"] = [];
            appData["error"] = [];
            res.send(appData);
          } 
          else if (checkEmail) {
            appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = "Sorry.. Email already exist";
            appData["data"] = [];
            appData["error"] = [];
            res.send(appData);
          } 
          else{
            const result = await customerSchema.findOneAndUpdate(
                id, updatedData, options
            )
            result.save(function (err, data) {
                if (err) {
                  appData["status"] = 400;
                  appData["appStatusCode"] = 2;
                  appData["message"] = "some error";
                  appData["data"] = [];
                  appData["error"] = err.message;
                  res.send(appData);
                } else {
                  appData["status"] = 200;
                  appData["appStatusCode"] = 0;
                  appData["message"] = "Successfully Updated";
                  appData["data"] = data;
                  appData["error"] = [];
                  res.send(appData);
                }
              });
          }

        
    } catch (error) {
        appData["status"] = 400;
        appData["appStatusCode"] = 2;
        appData["message"] = "Something went wrong";
        appData['data'] = [];
        appData['error'] = error;
        res.json(appData);
    }
}

const deleteCustomer = async(req,res)=>{
    try {
        const id = { customer_id: req.params.id };
        const updatedData = { n_Deleted: req.body.n_Deleted };
        const options = { new: true };
    
        const removeData = await customerSchema.findOneAndUpdate(
          id,
          updatedData,
          options
        );
        if (removeData) {
          appData["status"] = 200;
          appData["appStatusCode"] = 0;
          appData["message"] = "Your customer deleted";
          appData["data"] = removeData;
          appData["error"] = [];
        } else {
          appData["status"] = 200;
          appData["appStatusCode"] = 0;
          appData["message"] = "no customer found for this ID";
          appData["data"] = [];
          appData["error"] = [];
        }
        res.json(appData);
      } catch (error) {
        appData["status"] = 404;
        appData["appStatusCode"] = 2;
        appData["message"] = "Sorry, Something went wrong";
        appData["data"] = [];
        appData["error"] = error;
        res.json(appData);
      }
}

const customerStatus = async(req,res)=>{
    try {
        
        if(req.body.n_Status !== 0 || req.body.n_Status !== 1){
          appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = "Invalid customer status code";
            appData["data"] = [];
            appData["error"] = [];
          
          res.json(appData);
        }
        else{
          const id = { customer_id: req.params.id };
          const updatedData = { n_Status: req.body.n_Status };
          const options = { new: true };
      
          const removeData = await customerSchema.findOneAndUpdate(
            id,
            updatedData,
            options
          );
          if (removeData) {
            if (req.body.n_Status === 0) {
              appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = "Customer Deactivated successfully";
            appData["data"] = removeData;
            appData["error"] = [];
            } else {
              appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = "Customer Activated successfully";
            appData["data"] = removeData;
            appData["error"] = [];
            }
            
          } else {
            appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = "no customer found for this ID";
            appData["data"] = [];
            appData["error"] = [];
          }
          res.json(appData);


          
        }
        
      } catch (error) {
        appData["status"] = 404;
        appData["appStatusCode"] = 2;
        appData["message"] = "Sorry, Something went wrong";
        appData["data"] = [];
        appData["error"] = error;
        res.json(appData);
      }
}

const searchCustomer = async (req, res) => {
  try {
    const search = req.body.customer_name;
    if (search.length >= 3) {
      const searchAnswers = await customerSchema.find({
        customer_name: { $regex: search, $options: "i" },
      });

      if (searchAnswers.length > 0) {
        appData["status"] = 200;
        appData["appStatusCode"] = 0;
        appData["message"] = "Your search results are below";
        appData["data"] = searchAnswers;
        appData["error"] = [];

        res.json(appData);
      } else {
        appData["status"] = 200;
        appData["appStatusCode"] = 0;
        appData["message"] = "No customers found for your search";
        appData["data"] = [];
        appData["error"] = [];

        res.json(appData);
      }
    } else {
      appData["status"] = 200;
      appData["appStatusCode"] = 0;
      appData["message"] = "Min 3 characters required for your search";
      appData["data"] = [];
      appData["error"] = [];

      res.json(appData);
    }
  } catch (error) {
    appData["status"] = 404;
    appData["appStatusCode"] = 2;
    appData["message"] = "Sorry, Something went wrong";
    appData["data"] = [];
    appData["error"] = error;
    res.json(appData);
  }
};


const filterCustomer = async (req, res) => {
    try {
        const allcustomers = await customerSchema.find({});
        
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



module.exports = { createCustomer, getAllCustomers, getSingleCustomer, filterCustomer ,updateCustomer, deleteCustomer,customerStatus,searchCustomer}