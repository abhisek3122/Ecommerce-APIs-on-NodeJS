"use strict";
const mongoose = require("mongoose");
const Product = require("./product");
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
    productId: {      //ID for the product
      type: String,
      required:true
    },
    userId: {     //ID for the user
      type: String,
      required:true
    },
    quantity: {     //Quantity of the selected product
      type: Number,
      require: true
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

cartItemSchema.virtual('detailsC', {
    ref:'product',
    localField: 'productId',
    foreignField: 'productId',
    justOne: true
});

cartItemSchema.set('toObject', { virtuals: true });
cartItemSchema.set('toJSON', { virtuals: true });

const CartItem = mongoose.model("cartItem", cartItemSchema);
module.exports = CartItem;
