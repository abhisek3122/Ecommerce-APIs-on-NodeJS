"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deliverySchema = new Schema({
    buyerId: {
      type: String
      /*required:true*/
    },
    buyerName: {
      type:String
    },
    buyerEmail: {
      type:String
    },
    buyerAddress: {
      type:String
    },
    buyerContact: {
      type:String
    },
    orderId: {
      type:String
    },
    invoiceId: {
      type: String
    },
    productId: {
      type: String
    },
    quantity: {
      type: Number
    },
    deliveryId: {
      type: String
    },
    status: {
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

deliverySchema.virtual('details', {
    ref:'product',
    localField: 'productId',
    foreignField: 'productId',
    justOne: true
});

//cartItemSchema.set('toObject', { virtuals: true });
deliverySchema.set('toJSON', { virtuals: true });

const Delivery = mongoose.model("delivery", deliverySchema);
module.exports = Delivery;
