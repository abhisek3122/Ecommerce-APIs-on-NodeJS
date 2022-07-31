"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userId: {
        type: String,
        unique:true,
        required:true
    },
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32
    },
    verified: {
      type: String,
      default: "false"
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true
    },
    password: {
      type: String
    },
    rolee: { //spelling edited for security purpose -- ( 0-Admin 1-B2C 2-B2B 3-AdminSubRoles)
      type: Number,
      default: 1,
      required: true
    },
    curdProduct: {
      type: Number,
      default: 0,
      required: true
    },
    paymentBlocked: {
      type: Number,
      default: 0
    },
    requestedAdvanceOrder: {
      type: Number,
      default: 0
    },
    contactNumber: {
      type: Number,
      required: true
    },
    loyaltyPoint: {
      type: Number,
      default: 0
    },
    addressId: {
      type: String,
      required: false,
      default: "Not updated"
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

const User = mongoose.model("user", userSchema);
module.exports = User;
