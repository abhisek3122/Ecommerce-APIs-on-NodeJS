/*const router = require('express-promise-router')();
const userController = require('../controllers/users');
const adminController = require('../controllers/admin');
const productController = require('../controllers/product');
const paymentIntegration = require('../controllers/paymentIntegration');
const uploadController = require('../controllers/uploadController');
const deliveryController = require('../controllers/deliverytracking');

const { requireSignin, isAuth, isAdmin, isBuyer, isW_Buyer, isBuyerOrW_Buyer, isAdminOrSubAdmin, curdProduct } = require('../middleware/auth');
const { userById } = require('../middleware/prvi');
const upload = require('../middleware/upload');
const validator = require("../middleware/validator");*/


// Old routes
// Admin routes
//router.get("/secret/admin/:userId/:rolee", userById, requireSignin, isAuth, isAdmin, adminController.getUsersByrole); //CHECKED with uuidv4
//router.delete("/secret/admin/:userId/delete", userById, requireSignin, isAuth, isAdmin, adminController.deleteUser); //CHECKED with uuidv4

// User
//router.get("/test/:email", validator.test123, userController.test); //CHECKED
//router.post("/user/register", userController.registerUser); //CHECKED with uuidv4
//router.post("/user/login", userController.login); //CHECKED with uuidv4
//router.get("/user/:userId/getUserProfile", userById, requireSignin, isAuth, userController.getUserProfile); //CHECKED with uuidv4
//router.put("/user/:userId/updateUserProfile", userById, requireSignin, isAuth, userController.updateUserProfile); //CHECKED with uuidv4
//router.post("/user/logout", userController.logOut); //CHECKED - Update Auth check functions

// Product
//router.post("/product/:userId/add", userById, requireSignin, isAuth, isSeller, productController.addProduct); //CHECKED with uuidv4
//router.get("/product/:userId/all", userById, requireSignin, isAuth, productController.getAllProducts); //CHECKED with uuidv4
//router.get("/product/:userId/details/:productId", userById, requireSignin, isAuth, productController.getDetailsOfProduct); //CHECKED with uuidv4
//router.delete("/product/:userId/delete", userById, requireSignin, isAuth, isSeller, productController.deleteProduct); //CHECKED with uuidv4
//router.put("/product/:userId/update", userById, requireSignin, isAuth, isSeller, productController.updateProduct); //CHECKED with uuidv4
//router.get("/product/:userId/:productId/image", productController.getImages);

// Cart
//router.post("/user/:userId/addItemToCart", userById, requireSignin, isAuth, isBuyer, userController.addItemToCart); //CHECKED with uuidv4
//router.delete("/user/:userId/removeItemFromCart", userById, requireSignin, isAuth, isBuyer, userController.removeItemFromCart); //CHECKED with uuidv4
//router.put("/user/:userId/updateCartItemQuantity", userById, requireSignin, isAuth, isBuyer, userController.updateCartItemQuantity); //CHECKED with uuidv4
//router.get("/user/:userId/cartItems", userById, requireSignin, isAuth, isBuyer, userController.getCartItemsForUser); //CHECKED with uuidv4
//router.delete("/user/:userId/deleteAllCartItems", userById, requireSignin, isAuth, isBuyer, userController.deleteAllCartItemsForUser); //CHECKED with uuidv4
//router.get("/user/:userId/totalSum", userById, requireSignin, isAuth, isBuyer, userController.totalSum);

// Wishlist
//router.post("/user/:userId/addItemToWishlist", userById, requireSignin, isAuth, isBuyer, userController.addToWishList); //CHECKED with uuidv4
//router.delete("/user/:userId/removeFromWishlist", userById, requireSignin, isAuth, isBuyer, userController.removeFromWishlist); //CHECKED with uuidv4
//router.get("/user/:userId/getWishlistItems", userById, requireSignin, isAuth, isBuyer, userController.getWishlistItemsForUser); //CHECKED with uuidv4

//Payment integration - Razorpay
//router.post("/:userId/orders", paymentIntegration.createOrderRazorpay); //CHECKED - Update Auth check functions
//router.post("/:userId/payment", paymentIntegration.paymentOptionsRazorpay); //CHECKED - Update Auth check functions
//router.post("/:userId/verifyPayment", paymentIntegration.paymentVerify); //CHECKED - Update Auth check functions

//Delivery tracking
//router.get("/:userId/1/deliveryItems", deliveryController.deliveryItems1); //CHECKED Role Buyer - Update Auth check functions
//router.get("/:userId/2/deliveryItems", deliveryController.deliveryItems2); //CHECKED Role Seller - Update Auth check functions
//router.put("/:userId/:deliveryId/2/update", deliveryController.updateTracking); //CHECKED Role Seller - Update Auth check functions

//File uploader
//router.post("/:userId/:productId/upload", upload.array('image[]'),uploadController.picUpload); //CHECKED - multipart content type - Update Auth check functions

//module.exports = router;
