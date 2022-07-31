"use strict";
const User = require("./../models/user");
const Product = require("./../models/product");
const CartItem = require("./../models/cartItems");
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");
const Checkout = require("./../models/checkout");
const RequestB2B = require("./../models/requestB2B");
const b2bDiscount = require("../models/b2b-discounts");
const b2cDiscount = require("../models/b2c-discounts");
const Transaction = require("./../models/transaction");
const validationerror = require("./../models/ValidationError");
const Delivery = require("./../models/delivery");
const math = require('mathjs');
const crypto = require('crypto');
const logging = require("./../middleware/logger");
require('dotenv').config();

const Razorpay = require('razorpay');
let key_id=process.env.KEY_ID
let key_secret=process.env.KEY_SECRET
const instance = new Razorpay({
    key_id: key_id,
    key_secret: key_secret
})
/*const instance = new Razorpay({
    key_id: 'rzp_test_XV3eaMjv0vHGXy',
    key_secret: 'NeOgkzcfe8DUiPCwIjqN1CS6'
})*/

/* add payment block to order, only one invoice can be generated. code develop */

class PaymentIntegration {

  async detailsForOrderRazorpayCreateInvoice(req, res) {
    let userId = req.params.userId;
    let invoiceId = uuidv4();

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      if(user.paymentBlocked == 0){

        let cartItem = await CartItem.find({
          userId: userId
      }).populate('detailsC');
        console.log(cartItem);
        if(cartItem == null){
          logging(req.ip, "No cartitems found");
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

        let amountInPaise = math.evaluate(totalSum * 100);

        if (user.rolee == 1) {
          let invoice = new Checkout({
            userId: userId,
            userRole: user.rolee,
            invoiceId: invoiceId,
            productList: cartItem,
            amount: totalSum,
            discountAmount: totalDiscountB2cAmount,
            createdTime: moment(Date.now()).unix()
          });

          await invoice.save();
        }
        else if (user.rolee == 2) {
          let invoice = new Checkout({
            userId: userId,
            userRole: user.rolee,
            invoiceId: invoiceId,
            productList: cartItem,
            amount: totalSum,
            discountAmount: totalDiscountAmount,
            createdTime: moment(Date.now()).unix()
          });

          await invoice.save();
        }

        user.paymentBlocked = 1;
        await user.save();


        res.status(200).json({message:"ok"});

      }
      else {
        if(user.rolee == 2){
          logging(req.ip, "Invoice creation blocked, Old payment pending");
          res.status(400).json(new validationerror("Process Failed, Invoice creation blocked, Make old payment or apply request", 400));
        }
        else{
          logging(req.ip, "Invoice creation blocked, Old payment pending");
          res.status(400).json(new validationerror("Process Failed, Invoice creation blocked, Check already one, Make old payment", 400));
        }
      }

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  async blockedInvoiceRequestApply(req, res) {
    let userId = req.params.userId;
    let invoiceId = uuidv4();

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let cartItem = await CartItem.find({
        userId: userId
      }).populate('detailsC');
      if(cartItem == null){
        logging(req.ip, "No cartitems found");
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
        if(user.rolee == 1){ //B2B only
          let discountB2c = await b2cDiscount.findOne({
            productId: productId_x
          })
          if (!discountB2c){
            discountB2cAmount = 0;
          }
          else {
            discountB2cAmount = math.evaluate((discount.discount/100)*product.price);
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

      let amountInPaise = math.evaluate(totalSum * 100);

      let invoice = new RequestB2B({
        userId: userId,
        userRole: user.rolee,
        invoiceId: invoiceId,
        productList: cartItem,
        amount: totalSum,
        discountAmount: totalDiscountAmount,
        createdTime: moment(Date.now()).unix()
      });

      await invoice.save();
      res.status(200).json({message:"true"});

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  async blockedInvoiceRequestList(req, res) {
    let userId = req.params.userId;

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let requests = await RequestB2B.find();
      res.status(200).json({message:"true", list:requests});

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  async blockedInvoiceRequestAccept(req, res) {
    let userId = req.params.userId;
    let invoiceId = req.body.invoiceId;

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let requestedItems = await RequestB2B.findOne({
        invoiceId: invoiceId
      })
      if(requestedItems == null){
        logging(req.ip, "Invalid userId and invoiceId");
        res.status(400).json(new validationerror("Process Failed, Invoice not found. Please check", 400));
      }

      let invoice = new Checkout({
        userId: requestedItems.userId,
        userRole: requestedItems.userRole,
        invoiceId: requestedItems.invoiceId,
        productList: requestedItems.productList,
        amount: requestedItems.amount,
        discountAmount: requestedItems.discountAmount,
        createdTime: moment(Date.now()).unix()
      });

      await invoice.save();

      let requestedItemsDelete = await RequestB2B.deleteMany({
        invoiceId: invoiceId
      })

      user.requestedAdvanceOrder = 1;
      await user.save();

      res.status(200).json({message:"true"});

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  async listInvoices(req, res) {
    let userId = req.params.userId;

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let invoiceCheck = await Checkout.find({
        userId: userId
      });
      if(invoiceCheck == null){
        res.status(200).json({"message":"true"});
      }

      res.status(200).json({message:"true",invoices:invoiceCheck});

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  async deleteInvoices(req, res) {
    let userId = req.params.userId;
    let invoiceId = req.body.invoiceId;

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let checkoutDelete = await Checkout.deleteMany({
        userId: userId,
        invoiceId: invoiceId
      })
      if(checkoutDelete == null){
        logging(req.ip, "Invalid userId and invoiceId");
        res.status(400).json(new validationerror("Process Failed, Invoice not found. Please check", 400));
      }

      user.paymentBlocked = 0;
      await user.save();

      res.status(200).json({message:"true"});

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  async directDelivery(req, res){

      let userId = req.params.userId;
      let invoiceId = req.params.invoiceId

      if(userId == req.auth.userId){

          let user = await User.findOne({userId:userId});
          if (user == null) {
            logging(req.ip, "User not found");
            res.status(400).json(new validationerror("Process Failed, User not found", 400));
          }

          if(user.requestedAdvanceOrder == 0){

              let invoiceCheck = await Checkout.findOne({
                  userId: userId,
                  invoiceId: invoiceId
              });
              if(invoiceCheck == null){
                  logging(req.ip, "Invalid userId and invoiceId");
                  res.status(400).json(new validationerror("Process Failed, Invoice not found. Please check", 400));
              }
              invoiceCheck.payment_transaction = "Pending";
              await invoiceCheck.save();

              let invoiceRecall = await Checkout.findOne({
                  userId: userId,
                  invoiceId: invoiceId
              });

              let transaction = new Transaction({
                    userId: invoiceRecall.userId,
                    userRole: invoiceRecall.userRole,
                    invoiceId: invoiceRecall.invoiceId,
                    productList: invoiceRecall.productList,
                    amount: invoiceRecall.amount,
                    orderIdRazorPay: invoiceRecall.orderIdRazorPay,
                    razorpay_order_id: "Not Updated",
                    razorpay_payment_id: invoiceRecall.razorpay_payment_id,
                    razorpay_signature: invoiceRecall.razorpay_signature,
                    payment_transaction: invoiceRecall.payment_transaction,
                    createdTime: moment(Date.now()).unix(),
                    discountAmount: invoiceRecall.discountAmount
              });
              await transaction.save();

              let transactionData = await Transaction.findOne({
                  userId: userId,
                  invoiceId: invoiceId
              });

              for(let i=0; i < transactionData.productList.length; i++) {

                  let productBoughtItem = await Product.findOne({
                      productId: transactionData.productList[i].productId
                  });
                  let productBoughtItemQuantity = transactionData.productList[i].quantity;
                  productBoughtItem.quantity = math.evaluate( productBoughtItem.quantity - productBoughtItemQuantity );
                  productBoughtItem.sold = math.evaluate( productBoughtItem.sold + productBoughtItemQuantity );
                  await productBoughtItem.save();
              }

              for(let j=0; j < transactionData.productList.length; j++) {
                  let deliveryId = uuidv4();
                  let productcall = await Product.findOne({
                      productId: transactionData.productList[j].productId
                  });
                  let buyerDetails = await User.findOne({
                      userId: transactionData.userId
                  });

                  let deliveryItem = new Delivery({
                      deliveryId: deliveryId,
                      buyerId: transactionData.userId,
                      buyerName: buyerDetails.name,
                      buyerEmail: buyerDetails.email,
                      buyerAddress: buyerDetails.address,
                      buyerContact: buyerDetails.contactNumber,
                      orderId: "Not Updated",
                      productId: transactionData.productList[j].productId,
                      invoiceId: transactionData.invoiceId,
                      quantity: transactionData.productList[j].quantity,
                      createdTime: moment(Date.now()).unix()
                  });
                  await deliveryItem.save();
              }

              let checkoutCollectionRemove = await Checkout.deleteMany({
                  userId: userId,
                  invoiceId: invoiceId
              });

              res.status(200).json({message:"true"});

          }
          else {
              res.status(403).json(new validationerror("Payment Pending, Direct Order is blocked", 403));
          }

      }
      else {
        logging(req.ip, "Invalid userId");
        res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
      }

  }

  async paymentPending(req, res){

      let userId = req.params.userId;

      if(userId == req.auth.userId){

          let pendingData = await Transaction.find({
              userId: userId,
              payment_transaction: "Pending"
          });

          res.status(200).json({message:"true",pending:pendingData});

      }
      else {
        logging(req.ip, "Invalid userId");
        res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
      }

  }

  async pendingPaymentOrderGenerate(req, res){

      let userId = req.params.userId;
      let invoiceId = req.body.invoiceId;

      if(userId == req.auth.userId){

        let user = await User.findOne({userId:userId});
        if (user == null) {
          logging(req.ip, "User not found");
          res.status(400).json(new validationerror("Process Failed, User not found", 400));
        }

        let invoiceCheck = await Transaction.findOne({
          userId: userId,
          invoiceId: invoiceId
        });
        if(invoiceCheck == null){
          logging(req.ip, "Invalid userId and invoiceId");
          res.status(400).json(new validationerror("Process Failed, Invoice not found. Please check", 400));
        }

        let amountInPaise = math.evaluate(invoiceCheck.amount * 100);

        var options = {
          amount: amountInPaise,  // amount in the smallest currency unit
          currency: "INR",
          receipt: invoiceCheck.invoiceId
        };

        let deliveryData = await Delivery.find({
            userId: userId,
            invoiceId: invoiceId
        });

        instance.orders.create(options, function(err, order) {
          invoiceCheck.orderIdRazorPay = order.id;
          invoiceCheck.save();

          for (var x = 0; x < deliveryData.length; x++) {
              let deliveryDataCall = Delivery.findOne({
                  userId: userId,
                  deliveryId: deliveryData[x].deliveryId
              });
              deliveryDataCall.orderId = order.id;
              deliveryDataCall.save();
          }

        });

        res.status(200).json({message:"true"});

      }
      else {
        logging(req.ip, "Invalid userId");
        res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
      }

  }

  async pendingPaymentInit(req, res){

      let userId = req.params.userId;
      let invoiceId = req.params.invoiceId
      let key_id = instance.key_id; // Give the key to frontend - IMPORTANT

      if(userId == req.auth.userId){

        let user = await User.findOne({userId:userId});
        if (user == null) {
          logging(req.ip, "User not found");
          res.status(400).json(new validationerror("Process Failed, User not found", 400));
        }

        let invoiceCheck = await Transaction.findOne({
          userId: userId,
          invoiceId: invoiceId
        });
        if(invoiceCheck == null){
          logging(req.ip, "Invalid userId and invoiceId");
          res.status(400).json(new validationerror("Process Failed, Invoice not found. Please check", 400));
        }

        let totalSum = invoiceCheck.amount;
        let amountInPaise = math.evaluate(totalSum * 100);

        let currency = "INR";
        let name = "Tech";


        let orderId = invoiceCheck.orderIdRazorPay;
        let callbackURL = "http://127.0.0.1:4043/api/"+userId+"/"+invoiceId+"/pending/verifyPayment";;

        let prefillName = user.name;
        let prefilluserId = user.userId;
        let prefillEmail = user.email;
        let prefillContactNumber = user.contactNumber;

        let options = { // response manipulation bug fix
          key: key_id, // Enter the Key ID generated from the Dashboard
          amount: amountInPaise, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: currency,
          name: name,
          order_id: orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          callback_url: callbackURL,
          prefill: {
            name: prefillName,
            email: prefillEmail,
            userId: prefilluserId,
            contact: prefillContactNumber
          }
        }

        res.status(200).json(options);

      }
      else {
        logging(req.ip, "Invalid userId");
        res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
      }

  }

  async pendingPaymentVerify(req, res){

      let razorpay_payment_id = req.body.razorpay_payment_id;
      let razorpay_order_id = req.body.razorpay_order_id;
      let razorpay_signature = req.body.razorpay_signature;
      let userId = req.params.userId;
      let invoiceId = req.params.invoiceId;

      let invoiceCheck = await Transaction.findOne({
        userId: userId,
        invoiceId: invoiceId
      });
      if(invoiceCheck == null){
        logging(req.ip, "Invalid userId and invoiceId");
        res.status(400).json(new validationerror("Process Failed, Invoice not found. Please check", 400));
      }

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json({message:"User not found"});
      }

      let secret2 = instance.key_secret;
      let hash = crypto.createHmac('sha256', secret2)
                         .update(invoiceCheck.orderIdRazorPay+'|'+razorpay_payment_id)
                         .digest('hex');

      if( razorpay_signature == hash) {

          invoiceCheck.razorpay_order_id = razorpay_order_id;
          invoiceCheck.razorpay_payment_id = razorpay_payment_id;
          invoiceCheck.razorpay_signature = razorpay_signature;
          invoiceCheck.payment_transaction = "Success"
          await invoiceCheck.save();

          res.status(200).json({message:"true"})

      }
      else {
          res.status(401).json(new validationerror("Verification failer", 401));
      }

  }

  async createOrderRazorpay(req, res) {
    let userId = req.params.userId;
    let invoiceId = req.body.invoiceId;

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let invoiceCheck = await Checkout.findOne({
        userId: userId,
        invoiceId: invoiceId
      });
      if(invoiceCheck == null){
        logging(req.ip, "Invalid userId and invoiceId");
        res.status(400).json(new validationerror("Process Failed, Invoice not found. Please check", 400));
      }

      let amountInPaise = math.evaluate(invoiceCheck.amount * 100);

      var options = {
        amount: amountInPaise,  // amount in the smallest currency unit
        currency: "INR",
        receipt: invoiceCheck.invoiceId
      };

      instance.orders.create(options, function(err, order) {
        invoiceCheck.orderIdRazorPay = order.id;
        invoiceCheck.save();
      });

      res.status(200).json({message:"true"});

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  async paymentOptionsRazorpay(req, res){

    let userId = req.params.userId;
    let invoiceId = req.params.invoiceId
    let key_id = instance.key_id; // Give the key to frontend - IMPORTANT

    if(userId == req.auth.userId){

      let user = await User.findOne({userId:userId});
      if (user == null) {
        logging(req.ip, "User not found");
        res.status(400).json(new validationerror("Process Failed, User not found", 400));
      }

      let invoiceCheck = await Checkout.findOne({
        userId: userId,
        invoiceId: invoiceId
      });
      if(invoiceCheck == null){
        logging(req.ip, "Invalid userId and invoiceId");
        res.status(400).json(new validationerror("Process Failed, Invoice not found. Please check", 400));
      }

      let totalSum = invoiceCheck.amount;
      let amountInPaise = math.evaluate(totalSum * 100);

      let currency = "INR";
      let name = "Tech";


      let orderId = invoiceCheck.orderIdRazorPay;
      let callbackURL = "http://127.0.0.1:4043/api/"+userId+"/"+invoiceId+"/verifyPayment";

      let prefillName = user.name;
      let prefilluserId = user.userId;
      let prefillEmail = user.email;
      let prefillContactNumber = user.contactNumber;

      let options = { // response manipulation bug fix
        key: key_id, // Enter the Key ID generated from the Dashboard
        amount: amountInPaise, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: currency,
        name: name,
        order_id: orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        callback_url: callbackURL,
        prefill: {
          name: prefillName,
          email: prefillEmail,
          userId: prefilluserId,
          contact: prefillContactNumber
        }
      }

      res.status(200).json(options);

    }
    else {
      logging(req.ip, "Invalid userId");
      res.status(401).json(new validationerror("Process Failed, Unauthorized", 401));
    }

  }

  async paymentVerify(req, res){
    let razorpay_payment_id = req.body.razorpay_payment_id;
    let razorpay_order_id = req.body.razorpay_order_id;
    let razorpay_signature = req.body.razorpay_signature;
    let userId = req.params.userId;
    let invoiceId = req.params.invoiceId;

    let invoiceCheck = await Checkout.findOne({
      userId: userId,
      invoiceId: invoiceId
    });

    let user = await User.findOne({userId:userId});
    if (user == null) {
      logging(req.ip, "User not found");
      res.status(400).json({message:"User not found"});
    }

    let secret = instance.key_secret;
    let hash = crypto.createHmac('sha256', secret)
                       .update(invoiceCheck.orderIdRazorPay+'|'+razorpay_payment_id)
                       .digest('hex');
    console.log(hash);

    if( razorpay_signature == hash) {
      console.log("Transaction Success");

      let invoiceCheck = await Checkout.findOne({
        userId: userId,
        invoiceId: invoiceId
      });
      if(invoiceCheck == null){
        logging(req.ip, "Invalid userId and invoiceId");
        res.status(400).json(new validationerror("Process Failed, Invoice not found. Please check", 400));
      }

      invoiceCheck.razorpay_order_id = razorpay_order_id;
      invoiceCheck.razorpay_payment_id = razorpay_payment_id;
      invoiceCheck.razorpay_signature = razorpay_signature;
      invoiceCheck.payment_transaction = "Success";
      await invoiceCheck.save();

      let invoiceRecall = await Checkout.findOne({
        userId: userId,
        invoiceId: invoiceId
      });

      let transaction = new Transaction({
        userId: invoiceRecall.userId,
        userRole: invoiceRecall.userRole,
        invoiceId: invoiceRecall.invoiceId,
        productList: invoiceRecall.productList,
        amount: invoiceRecall.amount,
        orderIdRazorPay: invoiceRecall.orderIdRazorPay,
        razorpay_order_id: invoiceRecall.razorpay_order_id,
        razorpay_payment_id: invoiceRecall.razorpay_payment_id,
        razorpay_signature: invoiceRecall.razorpay_signature,
        payment_transaction: invoiceRecall.payment_transaction,
        createdTime: moment(Date.now()).unix(),
        discountAmount: invoiceRecall.discountAmount
      });
      await transaction.save();

      let transactionData = await Transaction.findOne({
        userId: userId,
        razorpay_order_id: razorpay_order_id
      });

      for(let i=0; i < transactionData.productList.length; i++) {

        let productBoughtItem = await Product.findOne({
          productId: transactionData.productList[i].productId
        })
        let productBoughtItemQuantity = transactionData.productList[i].quantity;
        productBoughtItem.quantity = math.evaluate( productBoughtItem.quantity - productBoughtItemQuantity );
        productBoughtItem.sold = math.evaluate( productBoughtItem.sold + productBoughtItemQuantity );
        await productBoughtItem.save();
      }

      for(let j=0; j < transactionData.productList.length; j++) {
        let deliveryId = uuidv4();
        let productcall = await Product.findOne({
          productId: transactionData.productList[j].productId
        });
        let buyerDetails = await User.findOne({
          userId: transactionData.userId
        });

        let deliveryItem = new Delivery({
          deliveryId: deliveryId,
          buyerId: transactionData.userId,
          buyerName: buyerDetails.name,
          buyerEmail: buyerDetails.email,
          buyerAddress: buyerDetails.address,
          buyerContact: buyerDetails.contactNumber,
          orderId: razorpay_order_id,
          productId: transactionData.productList[j].productId,
          invoiceId: transactionData.invoiceId,
          quantity: transactionData.productList[j].quantity,
          createdTime: moment(Date.now()).unix()
        });
        console.log(productcall.userId);
        await deliveryItem.save();
      }

      let checkoutCollectionRemove = await Checkout.deleteMany({
        userId: userId,
        invoiceId: invoiceId
      });

      if(user.requestedAdvanceOrder == 1){
        user.requestedAdvanceOrder = 0;
        await user.save();
      }
      else {
        user.paymentBlocked = 0;
        await user.save();
      }

      res.status(200).json({message:"true"})
    }
    else {
        res.status(401).json(new validationerror("Verification failer", 401));
    }
  }

  async test1(req, res){

      let secret1 = instance.key_secret;
      let razorpay_order_id = "order_HoU8aPUn4uWIbl"
      let razorpay_payment_id = "pay_HoUJJ918JnjIOP"
      let hash = crypto.createHmac('sha256', secret1)
                         .update(razorpay_order_id+'|'+razorpay_payment_id)
                         .digest('hex');
      console.log(hash);
      res.status(200).json({hash:hash})
  }

}

const paymentIntegration = new PaymentIntegration();
module.exports = paymentIntegration;
