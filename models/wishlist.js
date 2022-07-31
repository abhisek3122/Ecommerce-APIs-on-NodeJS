"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const product = require('./product');

const wishlistSchema = new Schema({
    productId: {
      type: String,
      required:true
    },
    userId: {
      type: String,
      required:true
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

wishlistSchema.virtual('detailsW', { 
    ref:'product',
    localField: 'productId',
    foreignField: 'productId',
    justOne: true
});

wishlistSchema.set('toJSON', { virtuals: true });

const Wishlist = mongoose.model("wishlist", wishlistSchema);
module.exports = Wishlist;
