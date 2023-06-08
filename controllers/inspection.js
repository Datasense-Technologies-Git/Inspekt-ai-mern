const {Inspections} = require("../models/inspectionModel");

var appData = {
    status: 0,
    message: "",
    data: [],
    error: [],
  };


const addInspection = async (req, res) => {
    try {
        const checkInspectionId = await Inspections.findOne({
            inspection_id: req.body.inspection_id,
          });
          if (checkInspectionId) {
            appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = "Please check. Inspection Id already exist";
            appData["data"] = [];
            appData["error"] = [];
            res.send(appData);
          } 
          else{
            let body = req.body;
            let newInspections = new Inspections(body);

            newInspections.save(function (err, data) {
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
                  appData["message"] = "Inspection added Successfully";
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

const getAllInspections = async (req, res) => {
    try {
        const allInspections = await Inspections.find({});
        if (allInspections.length > 0) {
            appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = `You have totally ${allInspections.length} Inspections`;
            appData["data"] = allInspections;
            appData["error"] = [];
            res.send(appData);
          } else {
            appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = "Currently you don't have any Inspections";
            appData["data"] = allInspections;
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

const getSingleInspection = async (req, res) => {
    try {
        const singleInspection = await Inspections.findOne({ inspection_id: req.body.inspection_id });
        if (singleInspection) {
            appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = "Your selected Inspection";
            appData['data'] = singleInspection;
            appData['error'] = [];

            res.send(appData);
        }
        else {
            appData["status"] = 200;
            appData["appStatusCode"] = 0;
            appData["message"] = "No results found (or) Invalid Inspection_id";
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

const deleteInspection = async(req,res)=>{
    try {
        if (req.body.n_Deleted === 0 || req.body.n_Deleted === 1) {
          const singleInspection = await Inspections.findOne({ inspection_id: req.params.id });
          if(singleInspection.n_Deleted == 0){
            appData["status"] = 200;
          appData["appStatusCode"] = 0;
          appData["message"] = "Your Inspection already deleted";
          appData["data"] = [];
          appData["error"] = [];
        
        res.send(appData);
          }
          else{
            const id = { inspection_id: req.params.id };
            const updatedData = { n_Deleted: req.body.n_Deleted };
            const options = { new: true };
            
            const removeData = await Inspections.findOneAndUpdate(
              id,
              updatedData,
              options
            );
            if (removeData) {
              appData["status"] = 200;
              appData["appStatusCode"] = 0;
              appData["message"] = "Your Inspection deleted";
              appData["data"] = removeData;
              appData["error"] = [];
            } else {
              appData["status"] = 200;
              appData["appStatusCode"] = 0;
              appData["message"] = "no Inspection found for this ID";
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

const searchInspection = async (req, res) => {
    try {
      const search = req.body.inspection_id;
      if (search.length >= 3) {
        const searchAnswers = await Inspections.find({
          inspection_id: { $regex: search, $options: "i" },
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
          appData["message"] = "No Inspections found for your search";
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

  const filterInspection = async (req, res) => {
    try {
      const InspectionNameList = req.body.Inspection_name;
  
      if (InspectionNameList.length > 0) {
        
        const finalFilter = await Inspections.find(
          { Inspection_name: { $in: InspectionNameList } });
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
            appData["message"] = "You don't have any Inspections for this filter";
            appData["data"] = [];
            appData["error"] = [];
  
            res.send(appData);
          }
      }
      else {
        appData["status"] = 200;
        appData["appStatusCode"] = 0;
        appData["message"] = "Please select atleast one Inspection name";
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
  };

  const updateInspection = async (req, res) => {
    try {
        const id = {inspection_id:req.params.id}
        const updatedData = req.body;
        const options = { new: true };
        delete updatedData.n_Deleted; 
            const result = await Inspections.findOneAndUpdate(
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
    } catch (error) {
        appData["status"] = 400;
        appData["appStatusCode"] = 2;
        appData["message"] = "Something went wrong";
        appData['data'] = [];
        appData['error'] = error;
        res.send(appData);
    }
}

module.exports ={ addInspection,getAllInspections,getSingleInspection,deleteInspection,searchInspection,filterInspection,updateInspection }