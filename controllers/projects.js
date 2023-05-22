const dataSchema = require('../models/projects');

var appData = {
    status: 0,
    message: "",
    data: [],
    error: [],
};

const createProject = async (req, res) => {
    try {
        const checkProjectName = await dataSchema.findOne({ project_name: req.body.project_name });
        const checkProjectId = await dataSchema.findOne({ project_id: req.body.project_id });
        if (checkProjectName || checkProjectId) {
            appData["status"] = 200;
            appData["message"] = "Project already exist";
            appData["data"] = [];
            appData["error"] = [];
        }
        else {
            const userdata = new dataSchema({
                project_name: req.body.project_name,
                project_id: req.body.project_id,
                cust_name: req.body.cust_name,
                description: req.body.description,
                built_year: req.body.built_year,
                no_of_floors: req.body.no_of_floors,
                street_1: req.body.street_1,
                street_2: req.body.street_2,
                city: req.body.city,
                zipcode: req.body.zipcode,
                country: req.body.country,
                state: req.body.state,
            })
            console.log(userdata);
            if (userdata.project_name.length === 0 || userdata.project_id.length === 0 || userdata.cust_name.length === 0 || userdata.description.length === 0 || userdata.built_year.length === 0 || userdata.no_of_floors.length === 0 || userdata.street_1.length === 0 || userdata.street_2.length === 0 || userdata.city.length === 0 || userdata.zipcode.length === 0 || userdata.country.length === 0 || userdata.state.length === 0) {
                appData["status"] = 200;
                appData["message"] = "Please fill all the fields";
                appData["data"] = [];
                appData["error"] = [];
            }
            else {
                const user = await userdata.save();
                appData["status"] = 200;
                appData["message"] = "Your project added Successfully";
                appData['data'] = user;
                appData["error"] = [];


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

const retriveAllProjects = async (req, res) => {
    try {
        const allprojects = await dataSchema.find({});
        appData["status"] = 200;
        appData["message"] = "Your all projects";
        appData['data'] = allprojects;
        appData['error'] = [];
        res.json(appData);
    }
    catch (error) {
        appData["status"] = 200;
        appData["message"] = "Something went wrong";
        appData['data'] = allprojects;
        appData['error'] = [];

        res.json(appData);
    }


}

const retriveSingleProject = async (req, res) => {
    try {
        const singleproject = await dataSchema.findOne({ project_id: req.body.project_id });
        if (singleproject) {

            appData["status"] = 200;
            appData["message"] = "Your selected project";
            appData['data'] = [singleproject];
            appData['error'] = [];

            res.json(appData);
        }
        else {
            appData["status"] = 200;
            appData["message"] = "No results found (or) Invalid project_id";
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

const filterProject = async (req, res) => {
    try {
        const allprojects = await dataSchema.find({});
        console.log(allprojects);
        if (allprojects.length > 0) {

            const filters = allprojects.filter((data) => data.project_name === req.body.project_name);
            console.log(filters);
            if (filters.length > 0) {

                appData["status"] = 200;
                appData["message"] = "Your filtered project";
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
            appData["message"] = "projects are empty";
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



module.exports = { createProject, retriveAllProjects, retriveSingleProject, filterProject }