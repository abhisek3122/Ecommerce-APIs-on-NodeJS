"use strict";
const bcrypt = require("bcryptjs");
const moment = require("moment");
const User = require("./../models/user");
const Product = require("./../models/product");
const CartItem = require("./../models/cartItems");
const Wishlist = require("./../models/wishlist");
const b2bDiscount = require("../models/b2b-discounts");
const b2cDiscount = require("../models/b2c-discounts");
const verifyDb = require("../models/verification-db");
const addressMod = require("../models/userAddress");
const validationerror = require("./../models/ValidationError");
const nodeMailer = require('./../utils/nodeMailer');
const ejs = require('ejs');
const math = require('mathjs');
const config = require("./../config.json");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const JSON5 = require('json5')

const logger = require("./../config/winston");
const logging = require("./../middleware/logger");
/*var redis = require('redis');
var JWTR =  require('jwt-redis').default;
var redisClient = redis.createClient();
var jwtr = new JWTR(redisClient);*/

class UserController {

  async test(req, res) {
    let a = "https://google.com";
    res.redirect(a);
    res.status(200).json({message:"true"});
  }

  // register a new user - CHECKED WORKING with uuidv4
  async registerUser(req, res) {

    let name = req.body.name;
    let email = req.body.email;
    let rolee = req.body.role;
    let userId = uuidv4();
    let salt = await bcrypt.genSaltSync(10);
    let password = await req.body.password;
    let contactNumber = req.body.contactNumber;

    let userbyEmail = await User.findOne({
      email: email
    });

    if (userbyEmail != null) {
      logging(req.ip, "Email already exists");
      return res.status(400).json(new validationerror("Process Failed, Email exists", 400));
    } else {
      if (rolee != 0 && rolee != 3 && rolee == 1) { //B2C
        let user = new User({
          name: name,
          email: email,
          rolee: rolee,
          verified: "false",
          password: await bcrypt.hashSync(password, salt),
          userId: userId,
          contactNumber: contactNumber,
          createdTime: moment(Date.now()).unix()
        });

        await user.save();

        /*****SEND EMAIL FOR VERIFICATION*******/
        var payload = {
          userId: user.userId,
          iat: moment().unix(),
          exp: moment(Date.now()).add(1, "days").unix()
        };
        var tokesecret = process.env.TOKEN_SECRET;
        var token = jwt.sign(payload, tokesecret);
        let verifyUUID = uuidv4();

        let verifyTokenAdd = new verifyDb({
          userId: userId,
          verifyUUID: verifyUUID,
          verifyToken: token,
          createdTime: moment(Date.now()).unix()
        });

        await verifyTokenAdd.save();

        //let link = "http://"+process.env.BASE_URL+":"+process.env.PORT+"/api/verification/user/"+userId+"/"+verifyUUID;
        let link = "http://localhost:4200/verification/"+userId+"/"+verifyUUID;
        let verifyMessage = "Welcome to BetterBuy! <br />Here is the verification link (only valid for 24 hours)<br /><a href="+link+">"+link+"</a>";

        await nodeMailer(
          email, 'Registered Successfully!', verifyMessage
        );

        res.status(200).json({ message:"true", userId:userId, name:name, email:email, role:rolee, contactNumber:contactNumber});
      }

      else {
        if (rolee != 0 && rolee != 3 && rolee == 2) { //B2B
          let user = new User({
            name: name,
            email: email,
            rolee: rolee,
            verified: "false",
            password: await bcrypt.hashSync(password, salt),
            userId: userId,
            contactNumber: contactNumber,
            createdTime: moment(Date.now()).unix()
          });

          await user.save();


          /*****SEND EMAIL FOR VERIFICATION*******/
          var payload = {
            userId: user.userId,
            iat: moment().unix(),
  	        exp: moment(Date.now()).add(1, "days").unix()
          };
          var tokesecret = process.env.TOKEN_SECRET;
          var token = jwt.sign(payload, tokesecret);
          let verifyUUID = uuidv4();

          let verifyTokenAdd = new verifyDb({
            userId: userId,
            verifyUUID: verifyUUID,
            verifyToken: token,
            createdTime: moment(Date.now()).unix()
          });

          await verifyTokenAdd.save();

          //let link = "http://"+process.env.BASE_URL+":"+process.env.PORT+"/api/verification/user/"+userId+"/"+verifyUUID;
          let link = "http://localhost:4200/verification/"+userId+"/"+verifyUUID;
          let verifyMessage = "Welcome to BetterBuy! <br />Here is the verification link (only valid for 24 hours)<br /><a href="+link+">"+link+"</a>";

          await nodeMailer(
            email, 'Registered Successfully!', verifyMessage
          );

          res.status(200).json({ message:"true", userId:userId, name:name, email:email, role:rolee, contactNumber:contactNumber});
        }
        else {
          logging(req.ip, "Signup failed");
          res.status(400).json(new validationerror("Process Failed, Try again", 400));
        }

      }
    }
  }

  // login api - CHECKED WORKING with uuidv4
  async login(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let user = await User.findOne({ email: email });
    let userId = user.userId;
    if (!user) {
      logging(req.ip, "User - Email not found");
      res.status(400).json(new validationerror("Process Failed, Check email and password", 400));
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        //let jwt = authMiddleware.createJWT(user);
        var payload = {
          userId: user.userId,
          role: user.rolee,
          iat: moment().unix(),
	        email: user.email,
	        exp: moment(Date.now()).add(14, "days").unix()
        };
        var tokesecret = process.env.TOKEN_SECRET;

        var token = jwt.sign(payload, tokesecret);
        /*const { userId, email, rolee, name, verified, curdProduct } = user;*/
        res.cookie("token", token, {expire: new Date() + 14*24*60*60});
	    res.cookie("userId", userId, {expire: new Date() + 14*24*60*60});

        if(user.rolee == 1 | user.rolee == 2){
          return res.status(200).json({ messgae:"true", token:token, name:user.name, userId:user.userId, email:user.email, role:user.rolee, verified:user.verified});
        }
        else if(user.rolee == 0 || user.rolee == 3){
          return res.status(200).json({ messgae:"true", token:token, name:user.name, userId:user.userId, email:user.email, role:user.rolee, verified:user.verified, productEditRole:user.curdProduct });
        }


      } else {
        /*res.status(400).json(new validationerror("Password is incorrect", 400));*/
        logging(req.ip, "Password Incorrect Failed");
        res.status(400).json(new validationerror("Process Failed, Check email and password", 400));
      }
    }
  }

  // logout from account - CHECKED WORKING
  async logOut(req, res) {
    res.clearCookie('token');
    res.send({ message: "Logged out successfully!" });
  }

  // get info - CHECKED WORKING with uuidv4
  async getUserProfile(req, res) {
    var userId = req.params.userId;

    if(userId == req.auth.userId){

      let user = await User.findOne({ userId: userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      if(user.rolee == 1 | user.rolee == 2){
        return res.status(200).json({ message:"true", name:user.name, userId:user.userId, email:user.email, role:user.rolee, addressId:user.addressId, contact:user.contactNumber, verified:user.verified, paymentBlocked:user.paymentBlocked});
      }
      else if(user.rolee == 0 || user.rolee == 3){
        return res.status(200).json({ message:"true", name:user.name, userId:user.userId, email:user.email, role:user.rolee, addressId:user.addressId, contact:user.contactNumber, verified:user.verified, productEditRole:user.curdProduct });
      }

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  //profile update - CHECKED WORKING with uuidv4
  /*async updateUserProfile(req, res) {
    let userId = req.params.userId;
    let address = req.body.address;

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }
      let response = await User.findOne({
          userId: userId,
      });
      user.address = address;
      user.updatedTime = moment(Date.now()).unix();

      await user.save();

      res.status(200).json({message:"true", address:address});

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

}*/

  //address updates
  async addAddress(req, res) {

      let userId = req.params.userId;
      let address = req.body.address;
      let addressId = uuidv4();

      if(userId == req.auth.userId){
          let user = await User.findOne({userId:userId});
          if (user == null) {
            logging(req.ip, "User not found");
            res.status(400).json(new validationerror("Process Failed, User not found", 400));
          }

          let addressAdd = new addressMod({
            userId: user.userId,
            addressId: addressId,
            address: address,
            createdTime: moment(Date.now()).unix()
          });
          await addressAdd.save();

          res.status(200).json({"message":"ok"})
      }
      else {
        logging(req.ip, "Invalid userId");
        res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
      }

  }

  async listAddress(req, res) {

      let userId = req.params.userId;

      if(userId == req.auth.userId){

          let user = await User.findOne({userId:userId});
          if (user == null) {
            logging(req.ip, "User not found");
            res.status(400).json(new validationerror("Process Failed, User not found", 400));
          }

          let response = await addressMod.find({
              userId: userId,
          });

          res.status(200).json({message:"true", addresses:response});

      }
      else {
        logging(req.ip, "Invalid userId");
        res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
      }

  }

  async idAddress(req, res) {
      let userId = req.params.userId;
      let addressId = req.params.addressId;

      if(userId == req.auth.userId){

          let user = await User.findOne({userId:userId});
          if (user == null) {
            logging(req.ip, "User not found");
            res.status(400).json(new validationerror("Process Failed, User not found", 400));
          }

          let response = await addressMod.find({
              userId: userId,
              addressId: addressId
          });

          res.status(200).json({message:"true", addresses:response});

      }
      else {
        logging(req.ip, "Invalid userId");
        res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
      }

  }

  async makeDefaultAddress(req, res) {
      let userId = req.params.userId;
      let addressId = req.body.addressId;

      if(userId == req.auth.userId){

          let user = await User.findOne({userId:userId});
          if (user == null) {
            logging(req.ip, "User not found");
            res.status(400).json(new validationerror("Process Failed, User not found", 400));
          }

          let check = await addressMod.findOne({
              userId: userId,
              default: 1
          });

          if(!check){
              let response = await addressMod.findOne({
                  userId: userId,
                  addressId: addressId
              });
              response.default = 1;
              response.updatedTime = moment(Date.now()).unix();

              user.addressId = addressId;

              await user.save();
              await response.save();

              return res.status(200).json({"message":"ok"});
          } else {
              check.default = 0;
              await check.save();

              let response = await addressMod.findOne({
                  userId: userId,
                  addressId: addressId
              });
              response.default = 1;
              response.updatedTime = moment(Date.now()).unix();

              user.addressId = addressId;

              await user.save();
              await response.save();

              return res.status(200).json({"message":"ok"});
          }

      }
      else {
        logging(req.ip, "Invalid userId");
        res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
      }

  }

  async editAddress(req, res) {
      let userId = req.params.userId;
      let addressId = req.body.addressId;
      let address = req.body.address;

      if(userId == req.auth.userId){

          let user = await User.findOne({userId:userId});
          if (user == null) {
            logging(req.ip, "User not found");
            res.status(400).json(new validationerror("Process Failed, User not found", 400));
          }

          let response = await addressMod.findOne({
              userId: userId,
              addressId: addressId
          });

          response.address = address;
          await response.save();

          return res.status(200).json({"message":"ok"})

      }
      else {
        logging(req.ip, "Invalid userId");
        res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
      }

  }

  async deleteAddress(req, res) {
      let userId = req.params.userId;
      let addressId = req.body.addressId;

      if(userId == req.auth.userId){

          let user = await User.findOne({userId:userId});
          if (user == null) {
            logging(req.ip, "User not found");
            res.status(400).json(new validationerror("Process Failed, User not found", 400));
          }

          let deletee = await addressMod.deleteMany({
            userId: userId,
            addressId: addressId
          });

          return res.status(200).json({"message":"ok"});

      }
      else {
        logging(req.ip, "Invalid userId");
        res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
      }

  }

  //add item to cart - CHECKED WORKING with uuidv4
  async addItemToCart(req, res) {
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
        exit();
      }

      let existed = await CartItem.findOne({
        userId: userId,
        productId: productId
      });

      if (!existed) {
        let cartItems = new CartItem({
          userId: userId,
          productId: productId,
          quantity: quantity,
          createdTime: moment(Date.now()).unix()
        });

        await cartItems.save();
        res.status(200).json({message:"true", userId:cartItems.userId, productId:cartItems.productId, quantity:cartItems.quantity});
      } else {
        logging(req.ip, "Cartitem already exists");
        res.status(400).json(new validationerror("Process Failed, Product already exists", 400));
      }

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  // remove items - CHECKED WORKING with uuidv4
  async removeItemFromCart(req, res) {
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

      let cartItem = await CartItem.deleteMany({
        userId: userId,
        productId: productId
      });

      res.status(200).json({message:"true"});

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }



  }

  //delete items - CHECKED WORKING with uuidv4
  async deleteAllCartItemsForUser(req, res) {
    let userId = req.params.userId;

    if(userId == req.auth.userId){

      let cartItem = await CartItem.deleteMany({
        userId: userId
      });

      res.status(200).json({message:"true"});

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }


  }

  // update cart - CHECKED WORKING with uuidv4
  async updateCartItemQuantity(req, res) {
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

      let cartItem = await CartItem.findOne({
        productId: productId,
        userId: userId
      });

      let rquantity = cartItem.quantity;

      let fquantity = math.evaluate(rquantity + quantity);
      cartItem.quantity = fquantity;
      cartItem.updatedTime = moment(Date.now()).unix();

      await cartItem.save();
      res.status(200).json({message:"true"});

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  //get cart items - CHECKED WORKING with uuidv4
  async getCartItemsForUser(req, res) {
    let userId = req.params.userId;

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let response = await CartItem.find({
        userId: userId
    }).populate('detailsC');
    console.log(response);
      res.status(200).json({message:"true",cartitems:response});

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  async totalSum(req, res) {
    let userId = req.params.userId;

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let cartItem = await CartItem.find({
        userId: userId
      });
      if(cartItem == null){
        logging(req.ip, "No items in cart");
        res.status(400).json(new validationerror("Process Failed, No cart items found", 400));
      }

      let totalSum = 0;
      let discountAmount = 0;
      let totalDiscountAmount = 0;
      let discountB2cAmount = 0;
      let totalDiscountB2cAmount = 0;

      let array_cartitems = cartItem;
      for (let x=0; x < array_cartitems.length; x++) {
        let productId_x = array_cartitems[x].productId;
        let productId_x_quantity = array_cartitems[x].quantity;
        let product = await Product.findOne({
          productId: productId_x
        });

        discountB2cAmount = 0;
        if(user.rolee == 1){ //B2C only
          let discountB2c = await b2cDiscount.findOne({
            productId: productId_x
          })
          if (!discountB2c){
            discountB2cAmount = 0;
          }
          else {
            discountB2cAmount = math.evaluate((discountB2c.discount/100)*product.price);
          }
        }

        discountAmount = 0;
        if(user.rolee == 2){ //B2B only
          let discount = await b2bDiscount.findOne({
            userId: userId,
            productId: productId_x
          })
          if (!discount){
            discountAmount = 0;
          }
          else {
            discountAmount = math.evaluate((discount.discount/100)*product.price);
          }
        }

        let productId_x_price = math.evaluate(product.price - discountAmount - discountB2cAmount);
        let mul_product = math.evaluate( productId_x_price * productId_x_quantity );
        totalDiscountAmount += math.evaluate(discountAmount * productId_x_quantity);
        totalDiscountB2cAmount += math.evaluate(discountB2cAmount * productId_x_quantity);
        totalSum += mul_product;
      }

      if (user.rolee == 2) {
        return res.status(200).json({message:"true", totalAmount: totalSum, discountAmount: totalDiscountAmount});
      }
      else {
        return res.status(200).json({message:"true123", totalAmount: totalSum, discountAmount: totalDiscountB2cAmount});
      }

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  //add item to wishist - CHECKED WORKING with uuidv4
  async addToWishList(req, res) {
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

      let existed = await Wishlist.findOne({
        userId: userId,
        productId: productId
      });

      if (!existed) {
        let wishlistItem = new Wishlist({
          userId: userId,
          productId: productId,
          createdTime: moment(Date.now()).unix()
        });

        await wishlistItem.save();
        res.status(200).json({message:"true", userId:wishlistItem.userId, productId:wishlistItem.productId});
      } else {
        logging(req.ip, "Wishlist item exists");
        res.status(400).json(new validationerror("Process Failed, Product already exists", 400));
      }

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  //remove wishlist - CHECKED WORKING with uuidv4
  async removeFromWishlist(req, res) {
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

      let response = await Wishlist.findOneAndDelete({
        userId: userId,
        productId: productId
      });

      res.status(200).json({message:"true"});

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  //get wishlist - CHECKED WORKING with uuidv4
  async getWishlistItemsForUser(req, res) {
    const userId = req.params.userId;

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let response = await Wishlist.find({userId:userId}).populate('detailsW');

      res.status(200).json({message:"true",products:response});

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }
}

const userController = new UserController();
module.exports = userController;
