"use strict";
const Product = require("../models/product");
const Delivery = require("../models/delivery");
const Transaction = require("./../models/transaction");
const User = require("./../models/user");
const math = require('mathjs');
const moment = require("moment");
const logging = require("./../middleware/logger");
const validationerror = require("./../models/ValidationError");
require('dotenv').config();

class DeliveryController {

  async deliveryItemsListAll(req, res){
    let userId = req.params.userId

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let deliveryItems = await Delivery.find().populate('details');
      if (deliveryItems == null) {
        logging(req.ip, "No delivery items found");
        res.status(400).json({"message":"true"});
      }

      res.status(200).json({message:"true",delivery:deliveryItems});

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  async deliveryItemsList(req, res){

      let userId = req.params.userId

      if(userId == req.auth.userId){

        let user = await User.findOne({userId:userId});
        if (user == null) {
          logging(req.ip, "User not found");
          res.status(400).json(new validationerror("Process Failed, User not found", 400));
        }

        let deliveryItems = await Delivery.find({buyerId: userId}).populate('details');
        if (deliveryItems == null) {
          logging(req.ip, "No delivery items found");
          res.status(400).json({"message":"true"});
        }

        res.status(200).json({message:"true",delivery:deliveryItems});

      }
      else {
        logging(req.ip, "Invalid userId");
        res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
      }

  }

  async deliveryItemsInvoice(req, res){
    let userId = req.params.userId
    let invoiceId = req.params.invoiceId

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let deliveryItems = await Delivery.findOne({
        buyerId: userId,
        invoiceId: invoiceId
      }).populate('details');
      if (deliveryItems == null) {
        logging(req.ip, "Invalid userId and invoiceId");
        res.status(400).json(new validationerror("Process Failed, Check invoice Id", 400));
      }

      res.status(200).json(deliveryItems);

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  async deliveryItemWithId(req, res){
    let userId = req.params.userId
    let deliveryId = req.params.deliveryId

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let deliveryItems = await Delivery.findOne({
        buyerId: userId,
        deliveryId: deliveryId
      }).populate('details');
      if (deliveryItems == null) {
        logging(req.ip, "Invalid userId and deliveryId");
        res.status(400).json(new validationerror("Process Failed, Check invoice Id", 400));
      }

      res.status(200).json(deliveryItems);

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  async updateDelivery(req, res) {
    let userId = req.params.userId;

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let deliveryId = req.params.deliveryId;

      let status = req.body.status;

      let response = await Delivery.findOne({
          deliveryId: deliveryId,
      });
      if (response == null) {
        logging(req.ip, "Invalid deliveryId");
        res.status(400).json(new validationerror("Process Failed, Check delivery Id", 400));
      }

      if (status == "Packed" || status == "Dispatched" || status == "Shipped" || status == "Delivered") {

          response.status = status;
          response.updatedTime = moment(Date.now()).unix();

          await response.save();
          res.status(200).json({message:"true"});

      } else {
          res.status(401).json(new validationerror("Invalid status update", 401));
      }


    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

}

const deliveryController = new DeliveryController();
module.exports = deliveryController;
