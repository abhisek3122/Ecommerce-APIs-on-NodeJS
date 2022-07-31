"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const checkoutSchema = new Schema({
    userId: {     //ID for the user
      type: String
      /*required:true*/
    },
    userRole: {
      type: Number,
      required: true
    },
    invoiceId: {      //ID for the generated invoice
      type: String
    },
    productList: [{   //List of Products bought
      type: Object
    }],
    orderIdRazorPay: {      //Generated ID for the payment process in Razorpay
      type: String,
      default: "Not Updated"
    },
    amount: {     //Amount to be paid
      type: Number
    },
    discountAmount: {
      type: Number
    },
    razorpay_payment_id: {      //Generated from Razorpay
      type: String,
      default: "Not Updated"
    },
    razorpay_order_id: {      //Generated from Razorpay
      type: String,
      default: "Not Updated"
    },
    razorpay_signature: {      //Generated from Razorpay - Verification
      type: String,
      default: "Not Updated"
    },
    payment_transaction: {      //Updating status "Success"
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

const Checkout = mongoose.model("checkout", checkoutSchema);
module.exports = Checkout;
