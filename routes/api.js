const router = require('express-promise-router')();
const userController = require('../controllers/users');
const adminController = require('../controllers/admin');
const productController = require('../controllers/product');
const paymentIntegration = require('../controllers/paymentIntegration');
const uploadController = require('../controllers/uploadController');
const deliveryController = require('../controllers/deliverytracking');
const discountController = require('../controllers/b2b-discounts');
const discountB2CController = require('../controllers/b2c-discounts');
const verificationController = require('../controllers/verificationController');
const businessAnalyticsController = require('../controllers/businessAnalytics');
//add is verified middleware
const { requireSignin, isAuth, isVerified, isAdmin, isBuyer, isW_Buyer, isBuyerOrW_Buyer, isAdminOrSubAdmin, curdProduct } = require('../middleware/auth');
const { userById } = require('../middleware/prvi');
const upload = require('../middleware/upload');
const validator = require("../middleware/validator");

// NEW ROUTES
// Test
router.get("/test", userController.test);
router.get("/test1", paymentIntegration.test1);


// Business Analytics
router.get("/secret/admin/:userId/analytics", validator.userId,
                                              userById, requireSignin, isAuth, isVerified, isAdmin,
                                              businessAnalyticsController.analytics);



// User
router.post("/user/register", validator.name, validator.email, validator.role, validator.contactNumber,
                              userController.registerUser); //CHECKED
router.post("/user/login", validator.email,
                           userController.login); //CHECKED
router.post("/user/logout", userController.logOut);
router.post("/secret/admin/:userId/register", validator.userId, validator.name, validator.email, validator.role, validator.contactNumber,
                                              userById, requireSignin, isAuth, isVerified, isAdmin,
                                              adminController.registerUserByAdmin); //CHECKED
router.get("/secret/admin/:userId/verify/list", validator.userId,
                                                userById, requireSignin, isAuth, isVerified, isAdmin,
                                                adminController.listVerificationList); //CHECKED
router.patch("/secret/admin/:userId/verify/:verifyid", validator.userId, validator.verifyid,
                                                       userById, requireSignin, isAuth, isVerified, isAdmin,
                                                       adminController.verificationUser); //CHECKED
router.get("/user/:userId/getUserProfile", validator.userId,
                                           userById, requireSignin, isAuth, isVerified,
                                           userController.getUserProfile); //CHECKED
/*router.put("/user/:userId/updateUserProfile", validator.userId, validator.address,
                                              userById, requireSignin, isAuth, isVerified,
                                              userController.updateUserProfile);*/ //CHECKED
router.post("/user/:userId/address/add", validator.userId,
                                         userById, requireSignin, isAuth, isVerified,
                                         userController.addAddress); //CHECKED
router.get("/user/:userId/address/list", validator.userId,
                                         userById, requireSignin, isAuth, isVerified,
                                         userController.listAddress); //CHECKED
router.get("/user/:userId/:addressId/address/view", validator.userId,
                                                    userById, requireSignin, isAuth, isVerified,
                                                    userController.idAddress) //CHECKED
router.post("/user/:userId/address/makeDefault", validator.userId,
                                                 userById, requireSignin, isAuth, isVerified,
                                                 userController.makeDefaultAddress); //CHECKED
router.post("/user/:userId/address/edit", validator.userId,
                                          userById, requireSignin, isAuth, isVerified,
                                          userController.editAddress);  //CHECKED
router.post("/user/:userId/address/delete", validator.userId,
                                            userById, requireSignin, isAuth, isVerified,
                                            userController.deleteAddress);



// User Verification and Forget Password
router.get("/verification/user/:userId/:verifyid", validator.userId, validator.verifyid,
                                                   verificationController.userVerification); //CHECKED
router.post("/verification/forgetpassword/request", validator.email,
                                                    verificationController.forgetpasswordVerificationRequest); //CHECKED
router.get("/verification/forgetpassword/:userId/:verifyid", validator.userId, validator.verifyid,
                                                             verificationController.forgetpasswordVerificationGET); //CHECKED
router.post("/verification/forgetpassword/:userId/:verifyid", validator.userId, validator.verifyid,
                                                             verificationController.forgetpasswordVerificationPOST); //CHECKED



// Product
router.post("/secret/admin/:userId/curdProduct/:subAccountId", validator.userId, validator.subAccountId,
                                                               userById, requireSignin, isAuth, isVerified, isAdmin,
                                                               adminController.curdProductRoleAdd); //CHECKED
router.post("/product/:userId/add", validator.userId, validator.product,
                                    userById, requireSignin, isAuth, isVerified, isAdminOrSubAdmin, curdProduct,
                                    productController.addProduct); //CHECKED
router.delete("/product/:userId/delete", validator.userId, validator.productId,
                                         userById, requireSignin, isAuth, isVerified, isAdminOrSubAdmin, curdProduct,
                                         productController.deleteProduct); //CHECKED
router.put("/product/:userId/update", validator.userId, validator.productId, validator.quantity,
                                      userById, requireSignin, isAuth, isVerified, isAdminOrSubAdmin, curdProduct,
                                      productController.updateProduct); //CHECKED
router.get("/product/:userId/:productId/image", validator.userId, validator.productId,
                                                userById, requireSignin, isAuth, isVerified,
                                                productController.getImages); //CHECKED
router.get("/product/:userId/all", validator.userId,
                                   userById, requireSignin, isAuth, isVerified,
                                   productController.getAllProducts); //CHECKED
router.get("/product/:userId/list/:category", validator.userId,
                                   userById, requireSignin, isAuth, isVerified,
                                   productController.getAllProductsByCategory);
router.get("/product/:userId/details/:productId", validator.userId, validator.productId,
                                                  userById, requireSignin, isAuth, isVerified,
                                                  productController.getDetailsOfProduct); //CHECKED
router.get("/product/:userId/:productId", validator.userId, validator.productId,
                                                  userById, requireSignin, isAuth, isVerified,
                                                  productController.getDetailsOfProductAndImage);


// File upload
router.post("/:userId/:productId/upload", validator.userId, validator.productId,
                                          userById, requireSignin, isAuth, isVerified, isAdminOrSubAdmin, curdProduct, upload.array('image[]'),
                                          uploadController.picUpload); //CHECKED



// Cart
router.post("/user/:userId/addItemToCart", validator.userId, validator.productId, validator.quantity,
                                           userById, requireSignin, isAuth, isVerified, isBuyerOrW_Buyer,
                                           userController.addItemToCart); //CHECKED
router.delete("/user/:userId/removeItemFromCart", validator.userId, validator.productId,
                                                  userById, requireSignin, isAuth, isVerified, isBuyerOrW_Buyer,
                                                  userController.removeItemFromCart); //CHECKED
router.put("/user/:userId/updateCartItemQuantity", validator.userId, validator.productId, validator.quantity,
                                                   userById, requireSignin, isAuth, isVerified, isBuyerOrW_Buyer,
                                                   userController.updateCartItemQuantity); //CHECKED
router.get("/user/:userId/cartItems", validator.userId,
                                      userById, requireSignin, isAuth, isVerified, isBuyerOrW_Buyer,
                                      userController.getCartItemsForUser); //CHECKED
router.delete("/user/:userId/deleteAllCartItems", validator.userId,
                                                  userById, requireSignin, isAuth, isVerified, isBuyerOrW_Buyer,
                                                  userController.deleteAllCartItemsForUser); //CHECKED
router.get("/user/:userId/totalSum", validator.userId,
                                     userById, requireSignin, isAuth, isVerified, isBuyerOrW_Buyer,
                                     userController.totalSum); //CHECKED



// Wishlist
router.post("/user/:userId/addItemToWishlist", validator.userId, validator.productId,
                                               userById, requireSignin, isAuth, isVerified, isBuyerOrW_Buyer,
                                               userController.addToWishList); //CHECKED
router.delete("/user/:userId/removeFromWishlist", validator.userId, validator.productId,
                                                  userById, requireSignin, isAuth, isVerified, isBuyerOrW_Buyer,
                                                  userController.removeFromWishlist); //CHECKED
router.get("/user/:userId/getWishlistItems", validator.userId,
                                             userById, requireSignin, isAuth, isVerified, isBuyerOrW_Buyer,
                                             userController.getWishlistItemsForUser); //CHECKED



// Discounts - B2B
router.post("/discount/:userId/add", validator.userId, validator.productId, validator.discount, validator.b2bUserId,
                                     userById, requireSignin, isAuth, isVerified, isAdmin,
                                     discountController.addDiscount); //CHECKED
router.post("/discount/:userId/remove", validator.userId, validator.productId, validator.b2bUserId,
                                        userById, requireSignin, isAuth, isVerified, isAdmin,
                                        discountController.removeDiscount); //CHECKED
router.post("/discount/:userId/update", validator.userId, validator.productId, validator.discount, validator.b2bUserId,
                                        userById, requireSignin, isAuth, isVerified, isAdmin,
                                        discountController.updateDiscount); //CHECKED



// Discounts - B2C - For all
router.post("/discount/b2c/:userId/add", validator.userId, validator.productId, validator.discount,
                                     userById, requireSignin, isAuth, isVerified, isAdmin,
                                     discountB2CController.addB2CDiscount); //CHECKED
router.post("/discount/b2c/:userId/remove", validator.userId, validator.productId,
                                        userById, requireSignin, isAuth, isVerified, isAdmin,
                                        discountB2CController.removeB2CDiscount); //CHECKED
router.post("/discount/b2c/:userId/update", validator.userId, validator.productId, validator.discount,
                                        userById, requireSignin, isAuth, isVerified, isAdmin,
                                        discountB2CController.updateB2CDiscount); //CHECKED



//Payment integration - Razorpay
router.post("/:userId/orders", validator.userId,
                               userById, requireSignin, isAuth, isVerified, isBuyerOrW_Buyer,
                               paymentIntegration.detailsForOrderRazorpayCreateInvoice); //CHECKED
router.get("/:userId/request/list", validator.userId,
                                    userById, requireSignin, isAuth, isVerified, isAdmin,
                                    paymentIntegration.blockedInvoiceRequestList); //CHECKED
router.post("/:userId/request/apply", validator.userId,
                                      userById, requireSignin, isAuth, isVerified, isW_Buyer,
                                      paymentIntegration.blockedInvoiceRequestApply); //CHECKED
router.post("/:userId/request/accept", validator.userId, validator.invoiceId,
                                       userById, requireSignin, isAuth, isVerified, isAdmin,
                                       paymentIntegration.blockedInvoiceRequestAccept); //CHECKED
router.get("/:userId/checkouts", validator.userId,
                                 userById, requireSignin, isAuth, isVerified, isBuyerOrW_Buyer,
                                 paymentIntegration.listInvoices); //CHECKED
router.delete("/:userId/checkouts/delete", validator.userId, validator.invoiceId,
                                           userById, requireSignin, isAuth, isVerified, isBuyerOrW_Buyer,
                                           paymentIntegration.deleteInvoices); //CHECKED
router.post("/:userId/:invoiceId/direct/delivery", validator.userId, validator.invoiceId,
                                           userById, requireSignin, isAuth, isVerified, isW_Buyer,
                                           paymentIntegration.directDelivery); //CHECKED
router.get("/:userId/pending/payments", validator.userId,
                                        userById, requireSignin, isAuth, isVerified, isW_Buyer,
                                        paymentIntegration.paymentPending); //CHECKED
router.post("/:userId/pending/createOrder", validator.userId, validator.invoiceId,
                                    userById, requireSignin, isAuth, isVerified, isW_Buyer,
                                    paymentIntegration.pendingPaymentOrderGenerate); //CHECKED
router.post("/:userId/:invoiceId/pending/paymentInit", validator.userId, validator.invoiceId,
                                           userById, requireSignin, isAuth, isVerified, isW_Buyer,
                                           paymentIntegration.pendingPaymentInit); //CHECKED


router.post("/:userId/:invoiceId/pending/verifyPayment", validator.userId, validator.invoiceId, validator.rasorpay,
                                                 userById, requireSignin, isAuth, isVerified, isW_Buyer,
                                                 paymentIntegration.pendingPaymentVerify);


router.post("/:userId/createOrder", validator.userId, validator.invoiceId,
                                    userById, requireSignin, isAuth, isVerified, isBuyerOrW_Buyer,
                                    paymentIntegration.createOrderRazorpay); //CHECKED
router.post("/:userId/:invoiceId/payment", validator.userId, validator.invoiceId,
                                           userById, requireSignin, isAuth, isVerified, isBuyerOrW_Buyer,
                                           paymentIntegration.paymentOptionsRazorpay); //CHECKED - options for front end
router.post("/:userId/:invoiceId/verifyPayment", validator.userId, validator.invoiceId, validator.rasorpay,
                                                 userById, requireSignin, isAuth, isVerified, isBuyerOrW_Buyer,
                                                 paymentIntegration.paymentVerify); // Can be checked after frontend done



//Delivery tracking - need to change
router.get("/:userId/deliveryItems/all", validator.userId,
                                         userById, requireSignin, isAuth, isVerified, isAdmin,
                                         deliveryController.deliveryItemsListAll); //CHECKED
router.get("/:userId/deliveryItems/list", validator.userId,
                                         userById, requireSignin, isAuth, isVerified, isBuyerOrW_Buyer,
                                         deliveryController.deliveryItemsList); //CHECKED
router.get("/:userId/deliveryItem/:invoiceId/invoice", validator.userId, validator.invoiceId,
                                                       userById, requireSignin, isAuth, isVerified, isBuyerOrW_Buyer,
                                                       deliveryController.deliveryItemsInvoice); //CHECKED
router.get("/:userId/deliveryItem/:deliveryId/", validator.userId, validator.deliveryId,
                                                 userById, requireSignin, isAuth, isVerified, isBuyerOrW_Buyer,
                                                 deliveryController.deliveryItemWithId); //CHECKED
router.put("/:userId/:deliveryId/update", validator.userId,
                                          userById, requireSignin, isAuth, isVerified, isAdmin,
                                          deliveryController.updateDelivery); //CHECKED



// Admin - Super privilege
router.get("/secret/admin/:userId/:role", validator.userId, validator.role,
                                          userById, requireSignin, isAuth, isVerified, isAdmin,
                                          adminController.getUsersByrole); //CHECKED
router.delete("/secret/admin/:userId/delete", validator.userId, validator.userDeleteId,
                                              userById, requireSignin, isAuth, isVerified, isAdmin,
                                              adminController.deleteUser); //CHECKED



module.exports = router;
