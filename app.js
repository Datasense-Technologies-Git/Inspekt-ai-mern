var express = require('express');
var bodyParser = require('body-parser');

var user = require('./routes/user'); // Imports routes for the user

var app = express();
// Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = 'mongodb://127.0.0.1:27017/myalt_Id';
// var dev_db_url = 'mongodb://Park3kmdsw:LoVeMaJuSs4uGcCPaRkInGNiKaSaBaRiDsSmArT@35.209.20.89/parking_mongo';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB,{ useNewUrlParser: true,useCreateIndex: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var cors = require('cors');
app.use(cors());
app.use(bodyParser.json({limit: '150mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '150mb', extended: true}));

app.use('/api/v1/users', user);

var port = 3003;

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});