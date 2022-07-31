"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestB2BSchema = new Schema({
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
    amount: {     //Amount to be paid
      type: Number
    },
    discountAmount: {
      type: Number
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

const RequestB2B = mongoose.model("requestB2B", requestB2BSchema);
module.exports = RequestB2B;
