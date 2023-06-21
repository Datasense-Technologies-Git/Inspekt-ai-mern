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

      const result = req.body;
      let _search =  { n_Deleted: 1 };
      if(result.searchTerm) {
        _search['$or'] = [
          {inspection_id: { $regex: result.searchTerm, $options: "i" }},
          {project_name: { $regex: result.searchTerm, $options: "i" }},
          {drone_operator: { $regex: result.searchTerm, $options: "i" }},
        ]
      }

      Inspections.aggregate(
        [
            { $match: _search},
            // {
            //     $lookup: {
            //         from: "projects",
            //         localField: 'customer_name',
            //         foreignField: "cust_name",
            //         as: "project"
            //     }
            // },
            
            // { $unwind: "$project" },
            // { $match: { "project.n_Deleted": 1 } },
            // { "$match": { "Orders": [] }},
            {$group: {
                _id: "$_id",
                dateCreation: { $first:"$dt_CreatedOn"},
                project_name: { $first: '$project_name'},
                inspection_id: { $first: '$inspection_id'},
                drone_operator: { $first: '$drone_operator'},
                model_url_3D: { $first: '$model_url_3D'},
                n_Deleted: {$first: '$n_Deleted'},
                total_defects: {$first: '$Overview.total_defects'},
                construction_quality: {$first: '$Overview.construction_quality'},
                energy_loss: {$first: '$Overview.energy_loss'},
                urgent: {$first: '$urgency.urgent'},
                medium: {$first: '$urgency.medium'},
                low: {$first: '$urgency.low'},
                safety_value: {$first: '$title.safety_value'},
                utility_value: {$first: '$title.utility_value'},
                regulatory_value: {$first: '$title.regulatory_value'},
                asset_value: {$first: '$title.asset_value'},
                cost_value: {$first: '$title.cost_value'},
                operation_value: {$first: '$title.option_value'},
                
                // total_projects: { $sum: 1},
                // c_Data: { $first: '$n_plan_data_limit'},
                // n_StartPrice:{$min:"$project.n_plan_price"},
                // projects: {$push: "$project"}
            }},
            {$sort: {"inspection_id": 1}},
              { $limit: result.n_limit },
              { $skip: result.n_skip },
  
        ]).then(function(docs) 
        {
            if(docs)
            {
                let myArr = [];
                docs.map((data,i)=>{
                  myArr.push({
                    _id:data._id,
                    date:data.dateCreation,
                    n_Deleted:data.n_Deleted,
                    project_name:data.project_name,
                    inspection_id:data.inspection_id,
                    drone_operator:data.drone_operator,
                    model_url_3D:data.model_url_3D,
                    Overview:{
                        total_defects:data.total_defects,
                        construction_quality:data.construction_quality,
                        energy_loss:data.energy_loss
                    },
                    urgency:{
                        urgent:data.urgent,
                        medium:data.medium,
                        low:data.low,
                    },
                    title:{
                        safety_value:data.safety_value,
                        utility_value:data.utility_value,
                        regulatory_value:data.regulatory_value,
                        asset_value:data.asset_value,
                        cost_value:data.cost_value,
                        operation_value:data.operation_value
                    }
                  })
                })
                appData["appStatusCode"] = 0;
                appData["message"] = "Your all inspections"
                appData["data"] = myArr
                appData["error"] = []
                res.send(appData)
            } else {
                appData["appStatusCode"] = 1;
                appData["message"] = ["Something went wrong"]
                appData["data"] = []
                appData["error"] = []
                res.send(appData)  
            } 
        }).catch((err)=>{
          appData["appStatusCode"] = 2;
          appData["message"] = "some error"
          appData["data"] = []
          appData["error"] = err
          res.send(appData)
        })
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
            appData['data'] = [singleInspection];
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
              
              appData["appStatusCode"] = 0;
              appData["message"] = "Your Inspection deleted";
              appData["data"] = removeData;
              appData["error"] = [];
            } else {
              
              appData["appStatusCode"] = 1;
              appData["message"] = "no Inspection found for this ID";
              appData["data"] = [];
              appData["error"] = [];
            }
            res.send(appData);
          }
          
        } else {
          appData["status"] = 200;
          appData["appStatusCode"] = 1;
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
      
      const projectNameList = req.body.project;
      const droneOpNameList = req.body.droneoperator;
      console.log(projectNameList ,'------ projectNameList');
      console.log(droneOpNameList ,'------ droneOpNameList');
      if ( projectNameList.length > 0 && droneOpNameList.length > 0 ) {
        Inspections.aggregate(
          [
              { $match: {n_Deleted: 1,
                $and: [
                {project_name: { $in: projectNameList }},
                {drone_operator: { $in: droneOpNameList }},
              ]
              
              }},
              // {
              //     $lookup: {
              //         from: "projects",
              //         localField: 'customer_name',
              //         foreignField: "cust_name",
              //         as: "project"
              //     }
              // },
              
              // { $unwind: "$project" },
              // { $match: { "project.n_Deleted": 1 } },
              // { "$match": { "Orders": [] }},
              {$group: {
                  _id: "$_id",
                  project_name: { $first: '$project_name'},
                  inspection_id: { $first: '$inspection_id'},
                  drone_operator: { $first: '$drone_operator'},
                  model_url_3D: { $first: '$model_url_3D'},
                  n_Deleted: {$first: '$n_Deleted'},
                  total_defects: {$first: '$Overview.total_defects'},
                  construction_quality: {$first: '$Overview.construction_quality'},
                  energy_loss: {$first: '$Overview.energy_loss'},
                  urgent: {$first: '$urgency.urgent'},
                  medium: {$first: '$urgency.medium'},
                  low: {$first: '$urgency.low'},
                  safety_value: {$first: '$title.safety_value'},
                  utility_value: {$first: '$title.utility_value'},
                  regulatory_value: {$first: '$title.regulatory_value'},
                  asset_value: {$first: '$title.asset_value'},
                  cost_value: {$first: '$title.cost_value'},
                  operation_value: {$first: '$title.option_value'},
                  
                  // total_projects: { $sum: 1},
                  // c_Data: { $first: '$n_plan_data_limit'},
                  // n_StartPrice:{$min:"$project.n_plan_price"},
                  // projects: {$push: "$project"}
              }},
              {$sort: {"inspection_id": 1}}
    
          ]).then(function(docs) 
          {
              if(docs)
              {
                  let myArr = [];
                  docs.map((data,i)=>{
                    myArr.push({
                      _id:data._id,
                      n_Deleted:data.n_Deleted,
                      project_name:data.project_name,
                      inspection_id:data.inspection_id,
                      drone_operator:data.drone_operator,
                      model_url_3D:data.model_url_3D,
                      Overview:{
                          total_defects:data.total_defects,
                          construction_quality:data.construction_quality,
                          energy_loss:data.energy_loss
                      },
                      urgency:{
                          urgent:data.urgent,
                          medium:data.medium,
                          low:data.low,
                      },
                      title:{
                          safety_value:data.safety_value,
                          utility_value:data.utility_value,
                          regulatory_value:data.regulatory_value,
                          asset_value:data.asset_value,
                          cost_value:data.cost_value,
                          operation_value:data.operation_value
                      }
                    })
                  })
                  appData["appStatusCode"] = 0;
                  appData["message"] = "Your all inspections"
                  appData["data"] = myArr
                  appData["error"] = []
                  res.send(appData)
              } else {
                  appData["appStatusCode"] = 1;
                  appData["message"] = ["Something went wrong"]
                  appData["data"] = []
                  appData["error"] = []
                  res.send(appData)  
              } 
          }).catch((err)=>{
            appData["appStatusCode"] = 2;
            appData["message"] = "some error"
            appData["data"] = []
            appData["error"] = err
            res.send(appData)
          })
      }
      else{
        console.log('------ else');
        Inspections.aggregate(
          [
              { $match: {n_Deleted: 1,
                $or: [
                {project_name: { $in: projectNameList }},
                {drone_operator: { $in: droneOpNameList }},
              ]
              
              }},
              // {
              //     $lookup: {
              //         from: "projects",
              //         localField: 'customer_name',
              //         foreignField: "cust_name",
              //         as: "project"
              //     }
              // },
              
              // { $unwind: "$project" },
              // { $match: { "project.n_Deleted": 1 } },
              // { "$match": { "Orders": [] }},
              {$group: {
                  _id: "$_id",
                  project_name: { $first: '$project_name'},
                  inspection_id: { $first: '$inspection_id'},
                  drone_operator: { $first: '$drone_operator'},
                  model_url_3D: { $first: '$model_url_3D'},
                  n_Deleted: {$first: '$n_Deleted'},
                  total_defects: {$first: '$Overview.total_defects'},
                  construction_quality: {$first: '$Overview.construction_quality'},
                  energy_loss: {$first: '$Overview.energy_loss'},
                  urgent: {$first: '$urgency.urgent'},
                  medium: {$first: '$urgency.medium'},
                  low: {$first: '$urgency.low'},
                  safety_value: {$first: '$title.safety_value'},
                  utility_value: {$first: '$title.utility_value'},
                  regulatory_value: {$first: '$title.regulatory_value'},
                  asset_value: {$first: '$title.asset_value'},
                  cost_value: {$first: '$title.cost_value'},
                  operation_value: {$first: '$title.option_value'},
                  
                  // total_projects: { $sum: 1},
                  // c_Data: { $first: '$n_plan_data_limit'},
                  // n_StartPrice:{$min:"$project.n_plan_price"},
                  // projects: {$push: "$project"}
              }},
              {$sort: {"inspection_id": 1}}
    
          ]).then(function(docs) 
          {
              if(docs)
              {
                  let myArr = [];
                  docs.map((data,i)=>{
                    myArr.push({
                      _id:data._id,
                      n_Deleted:data.n_Deleted,
                      project_name:data.project_name,
                      inspection_id:data.inspection_id,
                      drone_operator:data.drone_operator,
                      model_url_3D:data.model_url_3D,
                      Overview:{
                          total_defects:data.total_defects,
                          construction_quality:data.construction_quality,
                          energy_loss:data.energy_loss
                      },
                      urgency:{
                          urgent:data.urgent,
                          medium:data.medium,
                          low:data.low,
                      },
                      title:{
                          safety_value:data.safety_value,
                          utility_value:data.utility_value,
                          regulatory_value:data.regulatory_value,
                          asset_value:data.asset_value,
                          cost_value:data.cost_value,
                          operation_value:data.operation_value
                      }
                    })
                  })
                  appData["appStatusCode"] = 0;
                  appData["message"] = "Your all inspections"
                  appData["data"] = myArr
                  appData["error"] = []
                  res.send(appData)
              } else {
                  appData["appStatusCode"] = 1;
                  appData["message"] = ["Something went wrong"]
                  appData["data"] = []
                  appData["error"] = []
                  res.send(appData)  
              } 
          }).catch((err)=>{
            appData["appStatusCode"] = 2;
            appData["message"] = "some error"
            appData["data"] = []
            appData["error"] = err
            res.send(appData)
          })
      }
















  
      // if (InspectionNameList.length > 0) {
        
      //   const finalFilter = await Inspections.find(
      //     { Inspection_name: { $in: InspectionNameList } });
      //     if (finalFilter.length > 0) {
      //       appData["status"] = 200;
      //       appData["appStatusCode"] = 0;
      //       appData["message"] = "Your filtered results";
      //       appData["data"] = finalFilter;
      //       appData["error"] = [];
  
      //       res.send(appData);
      //     } else {
      //       appData["status"] = 200;
      //       appData["appStatusCode"] = 0;
      //       appData["message"] = "You don't have any Inspections for this filter";
      //       appData["data"] = [];
      //       appData["error"] = [];
  
      //       res.send(appData);
      //     }
      // }
      // else {
      //   appData["status"] = 200;
      //   appData["appStatusCode"] = 0;
      //   appData["message"] = "Please select atleast one Inspection name";
      //   appData["data"] = [];
      //   appData["error"] = [];
  
      //   res.send(appData);
      // }
    } catch (error) {
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
                  
                  appData["appStatusCode"] = 1;
                  appData["message"] = "some error";
                  appData["data"] = [];
                  appData["error"] = err.message;
                  res.send(appData);
                } else {
                  
                  appData["appStatusCode"] = 0;
                  appData["message"] = "Successfully Updated";
                  appData["data"] = data;
                  appData["error"] = [];
                  res.send(appData);
                }
              });
    } catch (error) {
        
        appData["appStatusCode"] = 2;
        appData["message"] = "Something went wrong";
        appData['data'] = [];
        appData['error'] = error;
        res.send(appData);
    }
}

module.exports ={ addInspection,getAllInspections,getSingleInspection,deleteInspection,searchInspection,filterInspection,updateInspection }