"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const verificationSchema = new Schema({
    userId: {
      type: String,
      required:true
    },
    verifyUUID: {
      type: String,
      required:true
    },
    verifyToken: {
      type: String,
      required: true,
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

const verification = mongoose.model("verification", verificationSchema);
module.exports = verification;
