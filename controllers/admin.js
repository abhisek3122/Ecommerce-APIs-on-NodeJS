"use strict";
const bcrypt = require("bcryptjs");
const moment = require("moment");
const User = require("./../models/user");
const Product = require("./../models/product");
const CartItem = require("./../models/cartItems");
const Wishlist = require("./../models/wishlist");
const validationerror = require("./../models/ValidationError");
const nodeMailer = require('./../utils/nodeMailer');
const ejs = require('ejs');
const math = require('mathjs');
const config = require("./../config.json");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
const logging = require("./../middleware/logger");
require('dotenv').config();

class AdminController {

  // register user by Admin
  async registerUserByAdmin(req, res) {
    let AdminUserId = req.params.userId;
    let user = await User.findOne({ userId: AdminUserId});
    if (user == null) {
      logging(req.ip, "User not found");
      res.status(400).json(new validationerror("Process Failed, User not found", 400));
    }

    let name = req.body.name;
    let email = req.body.email;
    let rolee = req.body.role;
    let userId = uuidv4();
    let salt = await bcrypt.genSaltSync(10);
    let password = await req.body.password;
    let contactNumber = req.body.contactNumber;

    let userbyEmail = await User.findOne({
      email: email
    });

    if (userbyEmail != null) {
      return res.status(400).send(new validationerror("Email already exists!", 400));
    } else {
      if (rolee == 2) { // add registration for 3 role with curd-0
        let user = new User({
          name: name,
          email: email,
          rolee: rolee,
          verified: "true",
          password: await bcrypt.hashSync(password, salt),
          userId: userId,
          contactNumber: contactNumber,
          createdTime: moment(Date.now()).unix()
        });

        await user.save();
        await nodeMailer.sendMail(
          email, 'Registered Successfully!', 'Welcome to Multikart!'
        );
        res.status(200).json({ message:"Registered Successfully!", userId:userId, name:name, email:email, rolee:rolee, contactNumber:contactNumber});
      }
      else {
        if(rolee == 3){
          let user = new User({
            name: name,
            email: email,
            rolee: rolee,
            verified: "true",
            password: await bcrypt.hashSync(password, salt),
            userId: userId,
            contactNumber: contactNumber,
            createdTime: moment(Date.now()).unix()
          });

          await user.save();
          await nodeMailer.sendMail(
            email, 'Registered Successfully!', 'Welcome to Multikart!'
          );
          res.status(200).json({ message:"Registered Successfully!", userId:userId, name:name, email:email, rolee:rolee, contactNumber:contactNumber});
        }
        else{
          logging(req.ip, "Registration failed from admin route");
          res.status(400).json({ message: "Register error, Please try again" });
        }

      }
    }
  }

  // Verification of B2B accounts
  async listVerificationList(req, res) {
    let userId = req.params.userId;

    if(userId == req.auth.userId){

      let user = await User.findOne({ userId: userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let response = await User.find({
        verified:"false"
      });
      res.status(200).json({message:"true", users:response})

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  // Do verification of user
  async verificationUser(req, res) {
    let userId = req.params.userId;

    if(userId == req.auth.userId){

      let user = await User.findOne({ userId: userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let verifyid = req.params.verifyid;
      let userDetails = await User.findOne({
        userId: verifyid
      });

      userDetails.verified = "true";
      await userDetails.save();
      res.status(200).json({message:"true"});

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  //admins get users - CHECKED WORKING with uuidv4
  async getUsersByrole(req, res) {
    let userId = req.params.userId;

    if(userId == req.auth.userId){

      let user = await User.findOne({ userId: userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let rolee = req.params.role;
      let response = await User.find({
          rolee:rolee
        },
        {
          password:0
        });
      res.status(200).json({message:"true", user:response});

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  // delete user -CHECKED WORKING with uuidv4
  async deleteUser(req, res) {
    let userId = req.params.userId;

    if(userId == req.auth.userId){

      let user = await User.findOne({ userId: userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let deleteUserId = req.body.userDeleteId;
      let response = await User.deleteMany({
        userId: deleteUserId
      });
      res.status(200).json({message: "true"});

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  // add product curd role
  async curdProductRoleAdd(req, res) {
    let userId = req.params.userId;

    if(userId == req.auth.userId){

      let user = await User.findOne({ userId: userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let subAccountId = req.params.subAccountId;

      let response = await User.findOne({
        userId: subAccountId
      });

      if(response.rolee == 3) {
        response.curdProduct = 1;
        await response.save();
        res.status(200).json({message:"true"});
      }
      else {
        logging(req.ip, "Unauthorized role giving tried");
        res.status(400).json(new validationerror("Process Failed, Unauthorized role. Not SubAdmin", 400));
      }

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

}

const adminController = new AdminController();
module.exports = adminController;
