"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const b2cDiscountSchema = new Schema({
    productId: {
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

const b2cDiscount = mongoose.model("b2cDiscount", b2cDiscountSchema);
module.exports = b2cDiscount;
