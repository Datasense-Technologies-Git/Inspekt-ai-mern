const { Inspections } = require("../models/inspectionModel");

var appData = {
  status: 0,
  message: "",
  data: [],
  error: [],
};

exports.addInspections = async (req, res) => {
  if (req.body && req.body.inspection_id) {
    let id = req.body.inspection_id;
    await Inspections.findOne({ inspection_id: id }, (err, result) => {
      if (!result) {
        let body = req.body;
        let newInspections = new Inspections(body);
        newInspections.save((err) => {
          if (!err) {
            appData["status"] = 0;
            appData["message"] = "Inspection added successfully!";
            res.status(200).send(appData);
          } else {
            appData["status"] = 11;
            appData["error"] = err.message;
            res.status(400).send(appData);
          }
        });
      } else {
        appData["status"] = 5;
        appData["error"] = "Inpsection Id already exists!";
        res.status(400).send(appData);
      }
    });
  }
};


exports.getAllInspections = async(req,res) => {
    if(req){
    try {
        const inspections = await Inspections.find({});
        appData["status"] = 0;
        appData["message"] = "Success!";
        appData['data'] = inspections;
        appData['error'] = [];
        res.status(200).send(appData);
    }
    catch (error) {
        appData["status"] = 200;
        appData["message"] = "Something went wrong";
        appData['data'] = [];
        appData['error'] = [];
        res.status(200).send(appData);

        res.status(400).send(appData);
        
    }
}
}