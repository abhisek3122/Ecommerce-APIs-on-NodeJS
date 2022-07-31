"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema(
  {
    userId: {
        type: String,
        required:true
    },
    addressId: {
        type: String,
        required:true
    },
    address: {
      type: String
    },
    default: {
      type: Number,
      default: 0
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

const AddressMod = mongoose.model("addressMod", addressSchema);
module.exports = AddressMod;
