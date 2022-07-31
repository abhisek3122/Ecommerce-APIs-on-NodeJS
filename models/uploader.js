"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const uploader = new Schema({
    userId: {
      type: String
    },
    productId: {
      type: String
    },
    image: [{
      type: Object
    }],
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

const Uploader = mongoose.model("uploader", uploader);
module.exports = Uploader;
