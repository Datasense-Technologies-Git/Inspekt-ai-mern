const {Customers} = require('../models/customers');
const util = require('../helper/util')
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
        const checkUserName = await Customers.findOne({
            user_name: req.body.user_name,
          });
          const checkCustomerName = await Customers.findOne({
            customer_name: req.body.customer_name,
          });
          const checkEmail = await Customers.findOne({
            customer_email: req.body.customer_email,
          });
          // console.log(util.emailRegexp());
          if (checkUserName || checkCustomerName || checkEmail) {
            appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = "Please check. Customer name or User name or email already exist";
            appData["data"] = [];
            appData["error"] = [];
            res.send(appData);
          } 
          else if ( !util.isEmail(req.body.customer_email) ) {
            appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = "Please enter valid email";
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
              const userdata = new Customers({
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
        res.send(appData)
    }

}

const getAllCustomers = async (req, res) => {
    try {
      
        Customers.aggregate(
          [
              { $match: { n_Deleted:1} },
              {
                  $lookup: {
                      from: "projects",
                      localField: 'customer_name',
                      foreignField: "cust_name",
                      as: "product"
                  }
              },
              { $unwind: "$product" },
              { $match: { "product.n_Deleted": 1 } },
              // { "$match": { "Orders": [] }},
              {$group: {
                  _id: "$_id",
                  user_name: { $first: '$user_name'},
                  customer_name: { $first: '$customer_name'},
                  customer_email: { $first: '$customer_email'},
                  customer_id: { $first: '$customer_id'},
                  total_projects: { $sum: 1},
                  // c_Data: { $first: '$n_plan_data_limit'},
                  // n_StartPrice:{$min:"$product.n_plan_price"},
                  product: {$push: "$product"}
                  // projects: {$push: 
                  //     {_id:"$product._id",
                  //     project_name:"$product.project_name",
                  //     project_id: "$product.project_id",
                  //     cust_name: "$product.cust_name",
                  //     built_year: "$product.built_year",
                  //     no_of_floors: "$product.no_of_floors",
                  //     street_1: "$product.street_1",
                  //     street_2: "$product.street_2",
                  //     city: "$product.city",
                  //     zipcode: "$product.zipcode",
                  //     country: "$product.country",
                  //     state: "$product.state",
                  //     }
                  // }
              }}

          ]).then(function(docs) 
          {
              if(docs)
              {
                  // var planName = ["","Diamond Plan","Gold Plan","Silver Plan"];
                  // for(var i = 0; i < docs.length;i++){
                  //     if(docs[i].n_plan_id==1) {
                  //         docs[i].c_Plan=planName[1]
                  //     } else if(docs[i].n_plan_id==2) {
                  //         docs[i].c_Plan=planName[2]
                  //     } else  if(docs[i].n_plan_id==3) {
                  //         docs[i].c_Plan=planName[3]
                  //     } else {
                  //         docs[i].c_Plan="Other name"
                  //     }
                  // }

                  appData["status"] = 1
                  appData["message"] = "Success1"
                  appData["data"] = docs
                  appData["error"] = []
                  res.send(appData) 
              } else {
                  appData["status"] = 0
                  appData["message"] = ["Something went wrong"]
                  appData["data"] = []
                  appData["error"] = []
                  res.send(appData)  
              } 
          }).catch((err)=>{
            appData["status"] = 1
            appData["message"] = "some error"
            appData["data"] = []
            appData["error"] = err
            res.send(appData)
          })
      
        
        // const allcustomers = await Customers.find({});
        // if (allcustomers.length > 0) {
        //     appData["status"] = 200;
        //     appData["appStatusCode"] = 0;
        //     appData["message"] = `You have totally ${allcustomers.length} customers`;
        //     appData["data"] = allcustomers;
        //     appData["error"] = [];
        //     res.send(appData);
        //   } else {
        //     appData["status"] = 200;
        //     appData["appStatusCode"] = 0;
        //     appData["message"] = "Currently you don't have any customers";
        //     appData["data"] = allcustomers;
        //     appData["error"] = [];
        //     res.send(appData);
        //   }
        } catch (error) {
          appData["status"] = 404;
          appData["appStatusCode"] = 2;
          appData["message"] = "Something went wrong";
          appData["data"] = [];
          appData["error"] = error;
      
          res.send(appData);
        }
}

const getSingleCustomer = async (req, res) => {
    try {
        const singleCustomer = await Customers.findOne({ customer_id: req.body.customer_id });
        if (singleCustomer) {

            appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = "Your selected customer";
            appData['data'] = singleCustomer;
            appData['error'] = [];

            res.send(appData);
        }
        else {
            appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = "No results found (or) Invalid customer_id";
            appData['data'] = [];
            appData['error'] = [];

            res.send(appData);
        }

    }
    catch (error) {
        appData["status"] = 404;
        appData["appStatusCode"] = 0;
        appData["message"] = "Something went wrong";
        appData['data'] = [];
        appData['error'] = error;

        res.send(appData);
    }
}




const updateCustomer = async (req, res) => {
    try {
        const id = {customer_id:req.params.id}
        const updatedData = req.body;
        const options = { new: true };
        delete updatedData.password; 
        delete updatedData.n_Status; 
        delete updatedData.n_Deleted; 

        // const checkUserName = await Customers.findOne({
        //     user_name: updatedData.user_name,
        //   });
        //   const checkCustomerName = await Customers.findOne({
        //     customer_name: updatedData.customer_name,
        //   });
        //   const checkEmail = await Customers.findOne({
        //     customer_email: updatedData.customer_email,
        //   });
        //   if (checkUserName) {
        //     appData["status"] = 200;
        //     appData["appStatusCode"] = 0;
        //     appData["message"] = "Sorry.. Username already exist";
        //     appData["data"] = [];
        //     appData["error"] = [];
        //     res.send(appData);
        //   } 
        //   else if (checkCustomerName) {
        //     appData["status"] = 200;
        //     appData["appStatusCode"] = 0;
        //     appData["message"] = "Sorry.. Customer name already exist";
        //     appData["data"] = [];
        //     appData["error"] = [];
        //     res.send(appData);
        //   } 
        //   else if (checkEmail) {
        //     appData["status"] = 200;
        //     appData["appStatusCode"] = 0;
        //     appData["message"] = "Sorry.. Email already exist";
        //     appData["data"] = [];
        //     appData["error"] = [];
        //     res.send(appData);
        //   } 
        //   else{
            const result = await Customers.findOneAndUpdate(
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
          // }
    } catch (error) {
        appData["status"] = 400;
        appData["appStatusCode"] = 2;
        appData["message"] = "Something went wrong";
        appData['data'] = [];
        appData['error'] = error;
        res.send(appData);
    }
}

const deleteCustomer = async(req,res)=>{
    try {
        if (req.body.n_Deleted === 0 || req.body.n_Deleted === 1) {
          const singleCustomer = await Customers.findOne({ customer_id: req.params.id });
          if(singleCustomer.n_Deleted == 0){
            appData["status"] = 200;
          appData["appStatusCode"] = 0;
          appData["message"] = "Your customer already deleted";
          appData["data"] = [];
          appData["error"] = [];
        
        res.send(appData);
          }
          else{
            const id = { customer_id: req.params.id };
            const updatedData = { n_Deleted: req.body.n_Deleted };
            const options = { new: true };
            
            const removeData = await Customers.findOneAndUpdate(
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
            res.send(appData);
          }
          
        } else {
          appData["status"] = 200;
          appData["appStatusCode"] = 0;
          appData["message"] = "Invalid code. The code should be 0 (or) 1";
          appData["data"] = [];
          appData["error"] = [];
        
        res.send(appData);
        }
        
      } catch (error) {
        appData["status"] = 404;
        appData["appStatusCode"] = 2;
        appData["message"] = "Sorry, Something went wrong";
        appData["data"] = [];
        appData["error"] = error;
        res.send(appData);
      }
}

const customerStatus = async(req,res)=>{
    try {
      console.log(req.body.n_Status);
        if(req.body.n_Status === 0 || req.body.n_Status === 1){
          
          const id = { customer_id: req.params.id };
          const updatedData = { n_Status: req.body.n_Status };
          const options = { new: true };
          
          const removeData = await Customers.findOneAndUpdate(
            id,
            updatedData,
            options
          );
          if (removeData) {
            if (req.body.n_Status === 0) {
              appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = "Customer Deactivated";
            appData["data"] = removeData;
            appData["error"] = [];
            } else {
              appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = "Customer Activated";
            appData["data"] = removeData;
            appData["error"] = [];
            }
            
          } else {
            appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = " Invalid Id (or) no customer found for this ID";
            appData["data"] = [];
            appData["error"] = [];
          }
          res.send(appData);
        }
        else{
          console.log('---------- 2');
          appData["status"] = 200;
          appData["appStatusCode"] = 0;
          appData["message"] = "Invalid customer status code";
          appData["data"] = [];
          appData["error"] = [];
        
        res.send(appData);
        }
        
      } catch (error) {
        console.log('------- 3');
        appData["status"] = 404;
        appData["appStatusCode"] = 2;
        appData["message"] = "Sorry, Something went wrong";
        appData["data"] = [];
        appData["error"] = error;
        res.send(appData);
      }
}

const searchCustomer = async (req, res) => {
  try {
    const search = req.body.customer_name;
    if (search.length >= 3) {
      const searchAnswers = await Customers.find({
        customer_name: { $regex: search, $options: "i" },
      });

      if (searchAnswers.length > 0) {
        appData["status"] = 200;
        appData["appStatusCode"] = 0;
        appData["message"] = "Your search results are below";
        appData["data"] = searchAnswers;
        appData["error"] = [];

        res.send(appData);
      } else {
        appData["status"] = 200;
        appData["appStatusCode"] = 0;
        appData["message"] = "No customers found for your search";
        appData["data"] = [];
        appData["error"] = [];

        res.send(appData);
      }
    } else {
      appData["status"] = 200;
      appData["appStatusCode"] = 0;
      appData["message"] = "Min 3 characters required for your search";
      appData["data"] = [];
      appData["error"] = [];

      res.send(appData);
    }
  } catch (error) {
    appData["status"] = 404;
    appData["appStatusCode"] = 2;
    appData["message"] = "Sorry, Something went wrong";
    appData["data"] = [];
    appData["error"] = error;
    res.send(appData);
  }
};


const filterCustomer = async (req, res) => {
  try {
    const custStatus = req.body.customer_status;
    
    if (custStatus !== "") {
      
      const finalFilter = await Customers.find({n_Status: {$eq: custStatus}})
        if (finalFilter.length > 0) {
          appData["status"] = 200;
          appData["appStatusCode"] = 0;
          appData["message"] = "Your filtered results";
          appData["data"] = finalFilter;
          appData["error"] = [];

          res.send(appData);
        } else {
          appData["status"] = 200;
          appData["appStatusCode"] = 0;
          appData["message"] = "You don't have any projects for this filter";
          appData["data"] = [];
          appData["error"] = [];

          res.send(appData);
        }
    }
    else {
      appData["status"] = 200;
      appData["appStatusCode"] = 0;
      appData["message"] = "Please select atleast one status";
      appData["data"] = [];
      appData["error"] = [];

      res.send(appData);
    }
  } catch (error) {
    appData["status"] = 404;
    appData["appStatusCode"] = 2;
    appData["message"] = "Something went wrong";
    appData["data"] = [];
    appData["error"] = error;

    res.send(appData);
  }
}



module.exports = { createCustomer, getAllCustomers, getSingleCustomer, filterCustomer ,updateCustomer, deleteCustomer,customerStatus,searchCustomer}