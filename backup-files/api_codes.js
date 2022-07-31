// finding totalSum
/*let totalSum = 0; Commented for backup
// need to change the calculation - Important
let array_cartitems = cartItem;
console.log(array_cartitems.length);
console.log(array_cartitems[0].productId);
for (let x=0; x < array_cartitems.length; x++) {
  let productId_x = array_cartitems[x].productId;
  let productId_x_quantity = array_cartitems[x].quantity;
  let product = await Product.findOne({
    productId: productId_x
  });
  let productId_x_price = product.price;
  let mul_product = math.evaluate( productId_x_price * productId_x_quantity );
  totalSum += mul_product;
}*/


// create order razorpay
/*let invoiceCheck = await Checkout.findOne({
  userId: userId
});
console.log(invoiceCheck);
//order creating
var options = {
  amount: amountInPaise,  // amount in the smallest currency unit
  currency: "INR",
  receipt: invoiceCheck.invoiceId
};
instance.orders.create(options, function(err, order) {
  console.log(order);
  invoiceCheck.orderIdRazorPay = order.id;
  invoiceCheck.save();
  console.log(invoiceCheck);
});
res.status(200).json({message:"ok"});*/

//remove invoiceId
/*let invoiceCollectionChecker = await Checkout.findOne({userId:userId});
if (user) {
  let checkoutCollectionRemove = await Checkout.deleteMany({
    userId: userId
  });
}*/
