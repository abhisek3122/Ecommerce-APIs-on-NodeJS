"use strict";
const Product = require("../models/product");
const b2bDiscount = require("../models/b2b-discounts");
const User = require("../models/user");
const moment = require("moment");
const logging = require("./../middleware/logger");
const validationerror = require("./../models/ValidationError");
require('dotenv').config();

class DiscountController {

  async addDiscount(req, res){
    let userId = req.params.userId;
    let productId = req.body.productId;
    let discount = req.body.discount;
    let b2bUserId = req.body.b2bUserId;

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let b2buser = await User.findOne({userId: b2bUserId});
      if(b2buser.rolee == 2){

        let check = await b2bDiscount.findOne({
          userId: b2bUserId,
          productId: productId
        })

        console.log(check);

        if(!check){
          let addDiscount = new b2bDiscount({
            userId: b2bUserId,
            productId: productId,
            discount: discount,
            createdTime: moment(Date.now()).unix()
          });

          await addDiscount.save();

          res.status(200).json({message:"Discount added"})
        }
        else {
          res.status(401).json(new validationerror("Process Failed, Discount found", 401));
        }

      }
      else{
        logging(req.ip, "Unauthorized role access tried");
        res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
      }

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  async removeDiscount(req, res) {
    let userId = req.params.userId;
    let productId = req.body.productId;
    let b2bUserId = req.body.b2bUserId;

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let b2buser = await User.findOne({userId: b2bUserId});
      if(b2buser.rolee == 2){

        let removeDiscount = await b2bDiscount.deleteMany({
          userId: b2bUserId,
          productId: productId
        })

        res.status(200).json({message:"Discount Removed"})

      }
      else{
        logging(req.ip, "Unauthorized role access tried");
        res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
      }

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  async updateDiscount(req, res) {
    let userId = req.params.userId;
    let productId = req.body.productId;
    let discount = req.body.discount;
    let b2bUserId = req.bodu.b2bUserId;

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let b2buser = await User.findOne({userId: b2bUserId});
      if(b2buser.rolee == 2){

        let updateDiscount = await b2bDiscount.findOne({
          userId: b2bUserId,
          productId: productId
        })

        updateDiscount.discount = discount;
        updateDiscount.updatedTime = moment(Date.now()).unix();
        await updateDiscount.save();

        res.status(200).json({message:"Discount Updated"})

      }
      else {
        logging(req.ip, "Unauthorized role access tried");
        res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
      }

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

}

const discountController = new DiscountController();
module.exports = discountController;
