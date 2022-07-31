'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const mongoose = require('./models/mongoose');
const api = require('./routes/api');
require('dotenv').config();

/*  LOGGER BUILT  */

const morgan = require('morgan');
var winston = require('./config/winston');
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', { stream: winston.stream }));

/*----------------*/

/*  CORS   */

var allowedOrigins = ['http://localhost:4200','http://localhost:4043', 'https://ecom-app.postman.co', 'https://ecom-test-app.postman.co', 'https://api.razorpay.com', 'https://razorpay.com', 'http://api.razorpay.com', 'http://razorpay.com']; //Remove postman after dev.
app.use(cors({
  credentials: true,
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

/*----------------*/

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static('public'));
app.use('/uploads/images', express.static('uploads/images'));

/*
      app.use(express.static(path.join(__dirname, "angular_build")));
      Use this statement when angular frontend is build and place on
      angular_build folder
*/

//import routes
app.use('/api', api);
/*app.get('/*', function(req, res) {
	res.redirect('/');
});*/


let port = process.env.PORT || 4043;
app.listen(port, function () {
    console.log(`Listening at port ${port}`);
    console.log("Server is running");
    // console.log(process.env.NODE_ENV);
  })
  .on('error', function (error) {
    console.log(error);
  });
