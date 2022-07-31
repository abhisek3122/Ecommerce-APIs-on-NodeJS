"use strict";
const User = require("./../models/user");
const verifyDb = require("../models/verification-db");
const verificationUser = require("./../models/verification-db");
const validationerror = require("./../models/ValidationError");
const nodeMailer = require('./../utils/nodeMailer');
const jwt = require("jsonwebtoken");
const config = require("./../config.json");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require('uuid');
const logging = require("./../middleware/logger");
require('dotenv').config();

class VerificationController {

   async userVerification(req, res){

     let userId = req.params.userId;
     let verifyId = req.params.verifyid;

     console.log(userId);
     let user = await User.findOne({ userId: userId});
     if (user == null) {
       logging(req.ip, "User not found");
       res.status(400).json(new validationerror("Process Failed, User not found", 400));
     }

     let verifyIdDetails = await verificationUser.findOne({ userId: userId, verifyUUID: verifyId});
     if (!verifyIdDetails) {
       logging(req.ip, "Invalid userId and verifyId");
       res.status(400).json(new validationerror("Process Failed", 400));
     }
     let token = verifyIdDetails.verifyToken;

     var decoded = jwt.verify(token, config.TOKEN_SECRET);

     if (decoded) {
       let verifyUser = await User.findOne({ userId: decoded.userId});
       verifyUser.verified = "true";
       await verifyUser.save();

       res.send("verified");
       res.status(200).json({message:"verified"});
       res.send("verified");
     }
     else {
       logging(req.ip, "Invalid JWT");
       res.send("invalid token");
       res.status(400).json(new validationerror("Process Failed", 400));

     }

   }

   async forgetpasswordVerificationRequest(req, res){

     let email = req.body.email;
     let user = await User.findOne({ email: email});
     let userId = user.userId;

     var payload = {
       userId: user.userId,
       iat: moment().unix(),
       exp: moment(Date.now()).add(1, "days").unix()
     };
     var tokesecret = process.env.TOKEN_SECRET;
     var token = jwt.sign(payload, tokesecret);
     let verifyUUID = uuidv4();

     let verifyTokenAdd = new verifyDb({
       userId: user.userId,
       verifyUUID: verifyUUID,
       verifyToken: token,
       createdTime: moment(Date.now()).unix()
     });

     await verifyTokenAdd.save();

     //let link = "http://"+process.env.BASE_URL+":"+process.env.PORT+"/api/verification/forgetpassword/"+userId+"/"+verifyUUID;
     let link = "http://localhost:4200/changepassword/"+userId+"/"+verifyUUID;
     let verifyMessage = "BetterBuy,<br />Here is the reset password link (only valid for 24 hours)<br /><br /><a href=\""+link+"\">"+link+"</a>";

     await nodeMailer(
       email, 'Reset Password', verifyMessage
     );

     res.status(200).json({message:"Mail will be sent if email exists in database"})
   }

   async forgetpasswordVerificationGET(req, res){

     let userId = req.params.userId;
     let verifyId = req.params.verifyid;

     let user = await User.findOne({ userId: userId});
     if (user == null) {
       logging(req.ip, "User not found");
       res.status(400).json(new validationerror("Process Failed, User not found", 400));
     }

     let verifyIdDetails = await verificationUser.findOne({ userId: userId, verifyUUID: verifyId});

     if (verifyIdDetails) {
       res.status(200).json({message:"true"})
     } else {
       logging(req.ip, "Invalid userId and verifyId");
       res.status(400).json(new validationerror("Process Failed", 400));
     }

   }

   async forgetpasswordVerificationPOST(req, res){

     let userId = req.params.userId;
     let verifyId = req.params.verifyid;
     let password = req.body.password;
     let salt = await bcrypt.genSaltSync(10);

     let user = await User.findOne({ userId: userId});
     if (user == null) {
       logging(req.ip, "User not found");
       res.status(400).json(new validationerror("Process Failed, User not found","Invalid UserId mentioned", 400));
     }

     let verifyIdDetails = await verificationUser.findOne({ userId: userId, verifyUUID: verifyId});

     if (verifyIdDetails) {

       let token = verifyIdDetails.verifyToken;
       var decoded = jwt.verify(token, config.TOKEN_SECRET);

       if (decoded) {

         let passwordHashed = bcrypt.hashSync(password, salt);
         user.password = passwordHashed;

         await user.save()

         res.status(200).json({message:"Password Changed"})

       } else {
         logging(req.ip, "Invalid JWT");
         res.status(400).json(new validationerror("Process Failed", 400));
       }

     } else {
       logging(req.ip, "Invalid userIdand verifyId");
       res.status(400).json(new validationerror("Process Failed", 400));
     }

   }

 }

 const verificationController = new VerificationController();
 module.exports = verificationController;
