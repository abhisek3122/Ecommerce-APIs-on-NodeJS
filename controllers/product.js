"use strict";
const Product = require("../models/product");
const User = require("../models/user");
const math = require('mathjs');
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');
const Uploader = require("./../models/uploader");
const logging = require("./../middleware/logger");
const validationerror = require("./../models/ValidationError");
require('dotenv').config();

class ProductController {

  //add product - CHECKED WORKING with uuidv4
  async addProduct(req, res) {
    let productId = uuidv4();
    let userId = req.params.userId;
    let title = req.body.title;
    let description = req.body.description;
    let category = req.body.category;
    let price = req.body.price;
    let quantity = req.body.quantity;
    let color = req.body.color;

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let product = new Product({
        userId: userId,
        productId: productId,
        title: title,
        description: description,
        category: category,
        price: price,
        quantity: quantity,
        color: color,
        createdTime: moment(Date.now()).unix()
      });

      await product.save();
      res.status(200).json({message: "true", title:product.title , description:product.description, price:product.price, category:product.category, color:product.color, quantity:product.quantity, productId:product.productId });

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  //all products - CHECKED WORKING with uuidv4
  async getAllProducts(req, res) {
    let userId = req.params.userId;

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let products = await Product.find();

      res.status(200).json({message:"true", products:products});

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  //all products with categry
  async getAllProductsByCategory(req, res){
    let userId = req.params.userId;
    let category = req.params.category;

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let products = await Product.find({
          category:category
      });
      res.status(200).json({message:"true", products:products});

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }
  }

  //get all details of product - CHECKED WORKING with uuidv4
  async getDetailsOfProduct(req, res) {
    let userId = req.params.userId;
    let productId = req.params.productId;

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let product = await Product.findOne({productId:productId});
      if (product == null) {
        logging(req.ip, "Product not found");
        res.status(400).json(new validationerror("Process Failed, Product not found", 400));
      }

      res.status(200).json({title:product.title , description:product.description, price:product.price, category:product.category, color:product.color, quantity:product.quantity, productId:product.productId });

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  //update product - CHECKED WORKING with uuidv4
  async updateProduct(req, res) {
    let userId = req.params.userId;
    let productId = req.body.productId;
    let quantity = req.body.quantity;

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let product = await Product.findOne({productId:productId});
      if (product == null) {
        logging(req.ip, "Product not found");
        res.status(400).json(new validationerror("Process Failed, Product not found", 400));
      }

      let rquantity = product.quantity;

      let fquantity = math.evaluate(rquantity + quantity);
      product.quantity = fquantity;
      product.updatedTime = moment(Date.now()).unix();

      await product.save();
      res.status(200).json({title:product.title , description:product.description, price:product.price, category:product.category, color:product.color, quantity:product.quantity, productId:product.productId });

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  //delete product - CHECKED WORKING with uuidv4
  async deleteProduct(req, res) {
    let userId = req.params.userId;
    let productId = req.body.productId;

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let product = await Product.findOne({productId:productId});
      if (product == null) {
        logging(req.ip, "Product not found");
        res.status(400).json(new validationerror("Process Failed, Product not found", 400));
      }

      let productremove = await Product.findOneAndDelete({
        productId: productId
      });

      res.status(200).json({message: "true"});

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  //upload image for product
  async getImages(req, res) {
    let userId = req.params.userId;
    let productId = req.params.productId;

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let product = await Product.findOne({productId:productId});
      if (product == null) {
        logging(req.ip, "Product not found");
        res.status(400).json(new validationerror("Process Failed, Product not found", 400));
      }

      let productImage = await Uploader.findOne({
        productId: productId
      });
      if(productImage == null){
        logging(req.ip, "Image not found");
        res.status(400).json(new validationerror("Process Failed, Image not found.", 400));
      }

      let fileNames = productImage.image;
      let filenameArray = fileNames[0].split(',');

      res.status(200).json({productId:productImage.productId, image1:filenameArray[0], image2:filenameArray[1], image3:filenameArray[2]});

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  async getDetailsOfProductAndImage(req, res){

      let userId = req.params.userId;
      let productId = req.params.productId;

      if(userId == req.auth.userId){

        let user = await User.findOne({userId:userId});
        if (user == null) {
          logging(req.ip, "User not found");
          res.status(400).json(new validationerror("Process Failed, User not found", 400));
        }

        let product = await Product.findOne({productId:productId});
        if (product == null) {
          logging(req.ip, "Product not found");
          res.status(400).json(new validationerror("Process Failed, Product not found", 400));
        }

        let productImage = await Uploader.findOne({
          productId: productId
        });

        if(productImage != null) {
        let fileNames = productImage.image;
        let filenameArray = fileNames[0].split(',');

        res.status(200).json({message:"true",product:[{
                              title:product.title,
                              description:product.description,
                              price:product.price,
                              category:product.category,
                              color:product.color,
                              quantity:product.quantity,
                              productId:product.productId,
                              image1:filenameArray[0],
                              image2:filenameArray[1],
                              image3:filenameArray[2]}]
                          });

        }

      }
      else {
        logging(req.ip, "Invalid userId");
        res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
      }

  }

}

const productController = new ProductController();
module.exports = productController;
