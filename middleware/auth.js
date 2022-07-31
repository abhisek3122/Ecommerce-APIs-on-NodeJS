const User = require('../models/user');
const expressJwt = require('express-jwt');
const config = require("./../config.json");
const logging = require("./logger");

exports.requireSignin = expressJwt({
  secret: config.TOKEN_SECRET,
  algorithms: ['HS256'],
  userProperty: 'auth' }), (req, res) => {
    logging(req.ip, "Not Logged in");
    return res.status(403).json({ error: "Not Signed IN" })
  };

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile.email == req.auth.email && req.profile.userId == req.auth.userId;
  if(!user) {
    logging(req.ip, "Unauthorized access");
    return res.status(403).json({
      error: "Access denied!"
    });
  }
  next();
}

exports.isVerified = (req, res, next) => {
  if(req.profile.verified != "true") {
    logging(req.ip, "Not verified");
    return res.status(403).json({
      error: 'Need to verify account'
    })
  }
  next();
}

exports.isAdmin = (req, res, next ) => {
  if(req.profile.rolee != 0) {
    logging(req.ip, "Tried Unauthorized Admin access");
    return res.status(403).json({
      error: 'Admin page! Access denied'
    })
  }
  next();
}

exports.isBuyer = (req, res, next ) => { //B2C customers
  if(req.profile.rolee != 1) {
    logging(req.ip, "Tried Unauthorized B2C access");
    return res.status(403).json({
      error: 'Buyer Access denied'
    })
  }
  next();
}

exports.isW_Buyer = (req, res, next ) => { //B2B customers
  if(req.profile.rolee != 2) {
    logging(req.ip, "Tried Unauthorized B2B access");
    return res.status(403).json({
      error: 'Buyer Access denied'
    })
  }
  next();
}

exports.isBuyerOrW_Buyer = (req, res, next) => {
  if(req.profile.rolee != 1 && req.profile.rolee != 2) {
    logging(req.ip, "Tried Unauthorized B2B B2C access");
    return res.status(403).json({
      error: 'Access denied'
    })
  }
  next();
}

exports.isAdminOrSubAdmin = (req, res, next) => {
  if(req.profile.rolee != 0 && req.profile.rolee != 3) {
    logging(req.ip, "Tried Unauthorized Admin Subadmin access");
    return res.status(403).json({
      error: 'Access denied'
    })
  }
  next();
}

exports.curdProduct = (req, res, next ) => {
  if(req.profile.curdProduct != 1) {
    logging(req.ip, "Tried Unauthorized curdProduct access");
    return res.status(403).json({
      error: 'Seller Access denied'
    })
  }
  next();
}
