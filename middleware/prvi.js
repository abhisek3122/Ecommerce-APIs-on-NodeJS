const User = require('../models/user');
const logging = require("./logger");

exports.userById = (req, res, next) => {
  let userId = req.params.userId;
  let user = User.findOne({ userId: userId }).exec((err, user) => {
    if(err || !user) {
      logging(req.ip, "Invalid userById, Not found");
      return res.status(400).json({
        error: "User not found"
      })
    }
    req.profile = user;
    next();
  })
}
