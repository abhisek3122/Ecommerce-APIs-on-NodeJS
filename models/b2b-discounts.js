"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const b2bDiscountSchema = new Schema({
    productId: {
      type: String,
      required:true
    },
    userId: {
      type: String,
      required:true
    },
    discount: {
      type: Number,
      required: true
      /*range: {
        min: { type: Number, min: 0 },
        max: { type: Number, min: 0 }
      }*/

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

const b2bDiscount = mongoose.model("b2bDiscount", b2bDiscountSchema);
module.exports = b2bDiscount;
