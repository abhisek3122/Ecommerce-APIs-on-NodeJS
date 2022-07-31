"use strict";
const Product = require("../models/product");
const b2bDiscount = require("../models/b2b-discounts");
const User = require("../models/user");
const moment = require("moment");
const logging = require("./../middleware/logger");
const Transaction = require("./../models/transaction");
const validationerror = require("./../models/ValidationError");
require('dotenv').config();

class BusinessController {

  async analytics(req, res){

    let userId = req.params.userId;

    let month = req.body.mm;
    let date = req.body.dd;
    let year = req.body.yyyy;
    let today = moment(Date.now()).unix();
    let todayFormatted = moment.unix(today).format("DD/MM/YYYY");
    let todayMonthFormatted = moment.unix(today).format("MM/YYYY");

    let dmy = date+"/"+month+"/"+year;
    let dm = date+"/"+month;
    let my = month+"/"+year;

    let thisDaySaleAmount = 0;
    let thisDaySaleDiscountAmount = 0;
    let thisMonthSaleAmount = 0;
    let thisMonthSaleDiscountAmount = 0;

    let user = await User.findOne({ userId: userId});
    if (user == null) {
      logging(req.ip, "User not found");
      res.status(400).json(new validationerror("Process Failed, User not found", 400));
    }

    let transactions = await Transaction.find();
    if (transactions == null) {
      logging(req.ip, "No delivery items found");
      res.status(400).json({"message":"true"});
    }

    let noOfTransactions = transactions.length;

    for (let i=0; i<noOfTransactions; i++){

      let dateFormatted = moment.unix(transactions.createdTimei[i]).format("DD/MM/YYYY");
      let monthFormatted = moment.unix(transactions.createdTimei[i]).format("MM/YYYY");

      if (dateFormatted == todayFormatted) {
        thisDaySaleAmount += transactions.amount[i];
        thisDaySaleDiscountAmount += transactions.discountAmount[i];
      }

      if (monthFormatted == todayMonthFormatted) {
        thisMonthSaleAmount += transactions.amount[i];
        thisMonthSaleDiscountAmount += transactions.discountAmount[i];
      }

    }

    res.status(200).json({ todaySaleAmount: thisDaySaleAmount, todaySaleDiscountAmount: thisDaySaleDiscountAmount,
                          thisMonthSaleAmount: thisMonthSaleAmount, thisMonthSaleDiscountAmount:thisMonthSaleDiscountAmount });

  }

}

const businessController = new BusinessController();
module.exports = businessController;
