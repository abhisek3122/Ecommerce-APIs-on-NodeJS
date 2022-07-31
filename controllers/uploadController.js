"use strict";
const User = require("./../models/user");
const Product = require("./../models/product");
const Uploader = require("./../models/uploader");
const moment = require("moment");
const logging = require("./../middleware/logger");
const validationerror = require("./../models/ValidationError");
require('dotenv').config();

class UploadController {

  async picUpload(req, res) {

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

      let productImage = new Uploader({
        userId: userId,
        productId: productId,
        createdTime: moment(Date.now()).unix()
      })

      /*if(req.file){  //Single file
        productImage.image = req.file.path
      }*/

      if(req.files) {
        let path = ''
        req.files.forEach(function(files, index, arr){
          path = path + files.path + ','
        })
        path = path.substring(0, path.lastIndexOf(","))
        productImage.image = path
        product.imageURL = path
      }

      await product.save();
      await productImage.save();

      let fileNames = productImage.image;
      let filenameArray = fileNames[0].split(',');

      res.status(200).json({message:"true"});

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

}

const uploadController = new UploadController();
module.exports = uploadController;
