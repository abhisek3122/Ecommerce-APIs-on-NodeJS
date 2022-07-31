"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    userId: {
      type: String
      /*required:true*/
    },
    userRole: {
      type: Number,
      required: true
    },
    invoiceId: {
      type: String
    },
    productList: [{
      type: Object
    }],
    orderIdRazorPay: {
      type: String,
      default: "Not Updated"
    },
    amount: {
      type: Number
    },
    discountAmount: {
      type: Number
    },
    razorpay_payment_id: {
      type: String,
      default: "Not Updated"
    },
    razorpay_order_id: {
      type: String,
      default: "Not Updated"
    },
    razorpay_signature: {
      type: String,
      default: "Not Updated"
    },
    payment_transaction: {
      type: String,
      default: "Not Updated"
    },
    createdTime: {
      type: Number
    },
    updatedTime:{
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Transaction = mongoose.model("transaction", transactionSchema);
module.exports = Transaction;
