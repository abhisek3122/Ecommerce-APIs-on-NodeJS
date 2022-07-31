"use strict";
const Product = require("../models/product");
const b2cDiscount = require("../models/b2c-discounts");
const User = require("../models/user");
const moment = require("moment");
const logging = require("./../middleware/logger");
const validationerror = require("./../models/ValidationError");
require('dotenv').config();

class DiscountController {

  async addB2CDiscount(req, res) {

    let userId = req.params.userId;
    let productId = req.body.productId;
    let discount = req.body.discount;

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let check = await b2cDiscount.findOne({
        productId: productId
      })

      if(!check){
        let addDiscount = new b2cDiscount({
          productId: productId,
          discount: discount,
          createdTime: moment(Date.now()).unix()
        });

        await addDiscount.save();

        res.status(200).json({message:"Discount added"})
      }
      else {
        res.status(400).json(new validationerror("Process Failed, Discount already exists", 401));
      }

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  async removeB2CDiscount(req, res) {

    let userId = req.params.userId;
    let productId = req.body.productId;

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let removeDiscount = await b2cDiscount.deleteMany({
        productId: productId
      })

      res.status(200).json({message:"Discount Removed"})

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  async updateB2CDiscount(req, res) {

    let userId = req.params.userId;
    let productId = req.body.productId;
    let discount = req.body.discount;

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let updateDiscount = await b2cDiscount.findOne({
        productId: productId
      })

      updateDiscount.discount = discount
      updateDiscount.updatedTime = moment(Date.now()).unix();
      await updateDiscount.save();

      res.status(200).json({message:"Discount Updated"})

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }


  }

}

const discountController = new DiscountController();
module.exports = discountController;
