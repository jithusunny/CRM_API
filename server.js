//Get references to packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var async = require('async');

//app will now use bodyParser() to extract data from POST request
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var mongoose = require('mongoose');

var config = require('./config.js');
mongoose.connect(config.db.development);

require('./routes/index')(app);

app.listen('8080');
console.log('Waiting for requests at port 8080');
