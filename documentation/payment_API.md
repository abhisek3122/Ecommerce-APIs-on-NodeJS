### PAYMENT API and Details
* Create Razorpay order for payment API
  * Endpoint: POST http://localhost:4200/api/:userId/orders
  * Authorization Bearer Token NEEDED
* Get order options and initiate from front-end API [Front-end useage API]
  * Endpoint: POST http://localhost:4200/api/:userId/payment
  * Authorization Bearer Token NEEDED
* Razorpay signature verification and Collection updation API
  * Endpoint: POST http://localhost:4200/api/:userId/verifyPayment
  * Authorization Bearer Token NEEDED
