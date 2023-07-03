const { CountryList } = require("../models/countrylist")

var appData = {
    appStatusCode: "",
    message: "",                                                                               
    data: [],
    error: "",
};

const countryList =  async (req, res) => {
    try {

        let zip_code =  req.body.zipcode;
        let _answer = parseInt(zip_code);

        CountryList.aggregate(
      [
          { $match: {
            $or: [
                { POSTAL_CODE: { $eq: _answer } },
                { POSTAL_CODE: { $eq: zip_code } },
              ]
          }
        },
            // POSTAL_CODE: { $eq: 641010 } }},
        //   { $match: { n_Deleted:1,n_Status: {$eq: custStatus}}},
          {$group: {
            _id: "$_id",
            city:{$first:'$CITY'},
              state: { $first: '$STATE'},
              country: { $first: '$COUNTRY'},
            //   customer_email: { $first: '$customer_email'},
            //   customer_id: { $first: '$customer_id'},
            //   n_Deleted: {$first: '$n_Deleted'},
            //   n_Status: {$first: '$n_Status'},
              // total_projects: { $sum: 1},
              // c_Data: { $first: '$n_plan_data_limit'},
              // n_StartPrice:{$min:"$product.n_plan_price"},
            //   projects: {$push: "$product"}
          }}

      ]).then(function(docs) 
      {
          if(docs)
          {
            appData["appStatusCode"] = 0;
            appData["message"] = `Your results`
            appData["data"] = docs
            appData["error"] = []
              res.send(appData)
          } else {
            appData["appStatusCode"] = 0;
            appData["message"] = `No data found`
            appData["data"] = ""
            appData["error"] = []
              res.send(appData)
          } 
      }).catch((err)=>{
        appData["appStatusCode"] = 4;
        appData["message"] = `something went wrong`
        appData["data"] = ""
        appData["error"] = err;
        res.send(appData)
      })
    } catch (error) {
        appData["appStatusCode"] = 4;
        appData["message"] = `Received error in catch`
        appData["data"] = ""
        appData["error"] = error
        res.send(appData)
    }
}


module.exports = { countryList }