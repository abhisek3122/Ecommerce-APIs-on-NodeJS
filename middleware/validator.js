const {check, validationResult} = require('express-validator');
const validationerror = require("./../models/ValidationError");
const logging = require("./logger");

exports.email = [
  check('email')
    .trim()
    .escape()
    .normalizeEmail()
    .not()
    .isEmpty()
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      //return res.status(422).json({/*errors: errors.array()*/});
      //logging(req.ip, "Invalid Email");
      return res.status(401).json(new validationerror("Process Failed, Check Input", 401));
    next();
  },
];

exports.name = [
  check('name')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .bail()
    .isLength({min: 3})
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      //return res.status(422).json({/*errors: errors.array()*/});
      //logging(req.ip, "Invalid Name");
      return res.status(401).json(new validationerror("Process Failed, Check Input", 401));
    next();
  },
];

exports.userId = [
  check('userId')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .bail()
    .isLength({min: 36, max: 36})
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      //return res.status(422).json({/*errors: errors.array()*/});
      //logging(req.ip, "Invalid UserId");
      return res.status(401).json(new validationerror("Process Failed, Check Input", 401));
    next();
  },
];

exports.userDeleteId = [
  check('userDeleteId')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .bail()
    .isLength({min: 36, max: 36})
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      //return res.status(422).json({/*errors: errors.array()*/});
      //logging(req.ip, "Invalid userDeleteId");
      return res.status(401).json(new validationerror("Process Failed, Check Input", 401));
    next();
  },
];

exports.subAccountId = [
  check('subAccountId')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .bail()
    .isLength({min: 36, max: 36})
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      //return res.status(422).json({/*errors: errors.array()*/});
      //logging(req.ip, "Invalid subAccountId");
      return res.status(401).json(new validationerror("Process Failed, Check Input", 401));
    next();
  },
];

exports.address = [
  check('address')
    .escape()
    .not()
    .isEmpty()
    .bail()
    .isLength({max: 40})
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      //return res.status(422).json({/*errors: errors.array()*/});
      //logging(req.ip, "Invalid address");
      return res.status(401).json(new validationerror("Process Failed, Check Input", 401));
    next();
  },
];

exports.contactNumber = [
  check('contactNumber')
    .escape()
    .isNumeric(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      //return res.status(422).json({/*errors: errors.array()*/});
      //logging(req.ip, "Invalid contactNumber");
      return res.status(401).json(new validationerror("Process Failed, Check Input", 401));
    next();
  },
];

exports.role = [
  check('role')
    .escape()
    .isNumeric(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      //return res.status(422).json({/*errors: errors.array()*/});
      //logging(req.ip, "Invalid role");
      return res.status(401).json(new validationerror("Process Failed, Check Input", 401));
    next();
  },
];

exports.productId = [
  check('productId')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .bail()
    .isLength({min: 36, max: 36})
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      //return res.status(422).json({/*errors: errors.array()*/});
      //logging(req.ip, "Invalid productId");
      return res.status(401).json(new validationerror("Process Failed, Check Input", 401));
    next();
  },
];

exports.invoiceId = [
  check('invoiceId')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .bail()
    .isLength({min: 36, max: 36})
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      //return res.status(422).json({/*errors: errors.array()*/});
      //logging(req.ip, "Invalid invoiceId");
      return res.status(401).json(new validationerror("Process Failed, Check Input", 401));
    next();
  },
];

exports.deliveryId = [
  check('deliveryId')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .bail()
    .isLength({min: 36, max: 36})
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      //return res.status(422).json({/*errors: errors.array()*/});
      //logging(req.ip, "Invalid deliveryId");
      return res.status(401).json(new validationerror("Process Failed, Check Input", 401));
    next();
  },
];

exports.b2bUserId = [
  check('b2bUserId')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .bail()
    .isLength({min: 36, max: 36})
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      //return res.status(422).json({/*errors: errors.array()*/});
      //logging(req.ip, "Invalid b2bUserId");
      return res.status(401).json(new validationerror("Process Failed, Check Input", 401));
    next();
  },
];

exports.verifyid = [
  check('verifyid')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .bail()
    .isLength({min: 36, max: 36})
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      //return res.status(422).json({/*errors: errors.array()*/});
      //logging(req.ip, "Invalid verifyid");
      return res.status(401).json(new validationerror("Process Failed, Check Input", 401));
    next();
  },
];

exports.quantity = [
  check('quantity')
    .escape()
    .isNumeric(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      //return res.status(422).json({/*errors: errors.array()*/});
      //logging(req.ip, "Invalid quantity");
      return res.status(401).json(new validationerror("Process Failed, Check Input", 401));
    next();
  },
];

exports.discount = [
  check('discount')
    .escape()
    .isNumeric(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      //return res.status(422).json({/*errors: errors.array()*/});
      //logging(req.ip, "Invalid discount");
      return res.status(401).json(new validationerror("Process Failed, Check Input", 401));
    next();
  },
];

exports.product = [
  check('title')
    .escape()
    .not()
    .isEmpty()
    .bail()
    .isLength({max: 40})
    .bail(),
  check('description')
    .escape()
    .not()
    .isEmpty()
    .bail()
    .isLength({max: 70})
    .bail(),
  check('category')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .bail()
    .isLength({min: 1})
    .bail(),
  check('price')
    .escape()
    .isNumeric(),
  check('quantity')
    .escape()
    .isNumeric(),
  check('color')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .bail()
    .isLength({min: 1})
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      //return res.status(422).json({/*errors: errors.array()*/});
      //logging(req.ip, "Invalid product");
      return res.status(401).json(new validationerror("Process Failed, Check Input", 401));
    next();
  },
];

exports.rasorpay = [
  check('razorpay_payment_id')
    .escape()
    .trim(),
  check('razorpay_order_id')
    .escape()
    .trim(),
  check('razorpay_signature')
    .escape()
    .trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      //return res.status(422).json({/*errors: errors.array()*/});
      //logging(req.ip, "Invalid rasorpay");
      return res.status(401).json(new validationerror("Process Failed, Check Input", 401));
    next();
  },
];
