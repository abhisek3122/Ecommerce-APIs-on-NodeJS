"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        productId: {
          type: String,
          required:true
        },
        title: {
          type: String,
          required: true,
          maxlength: 32
        },
        userId: {
          type: String,
          required:true
        },
        description: {
          type: String,
          required: true,
          maxlength: 500
        },
        price: {
          type: Number,
          trim: true,
          required: true,
          maxlength: 32
        },
        category: {
          type: String,
          ref: 'Category',
          required: true
        },
        color: {
          type: String
        },
        quantity: {
          type: Number,
          required: true
        },
        sold: {
          type: Number,
          default: 0
        },
        loyaltyPoint: {
          type: Number,
          required: false,
          default: 0
        },
        photo: {
          data: Buffer,
          contentType: String
        },
        shipping: {
          required: false,
          type: Boolean
        },
        imageURL: [{
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

const Product = mongoose.model("product", productSchema);
module.exports = Product;
