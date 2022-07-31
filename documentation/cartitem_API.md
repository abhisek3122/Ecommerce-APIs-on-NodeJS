### CARTITEM API and Details
* Add to cart API
  * Endpoint: POST http://localhost:4200/api/user/:userId/addItemToCart
  * Request Headers: Content-Type "application/json"<br /> ```{"productId":"5b8ef4b2-9c36-44d4-9bb2-037211760fbd","quantity":10}```
  * Authorization Bearer Token NEEDED
* Remove from cart - specific API
  * Endpoint: DELETE http://localhost:4200/api/user/:userId/removeItemFromCart
  * Request Headers: Content-Type "application/json"<br /> ```{"productId":"b85ff3c6-65fe-4812-b337-54ad07f43e16","quantity":4}```
  * Authorization Bearer Token NEEDED
* Update cart - specific API
  * Endpoint: PUT http://localhost:4200/api/user/:userId/updateCartItemQuantity
  * Request Headers: Content-Type "application/json"<br /> ```{"productId":"b85ff3c6-65fe-4812-b337-54ad07f43e16","quantity":4}```
  * Authorization Bearer Token NEEDED
* Delete all items from cart - specific API
  * Endpoint: DELETE http://localhost:4200/api/user/:userId/deleteAllCartItems
  * Authorization Bearer Token NEEDED
* Get the cartitems list - specific API
  * Endpoint: GET http://localhost:4200/api/user/:userId/cartItems
  * Authorization Bearer Token NEEDED
* Total amount/cost for cartitems - specific API
  * Endpoint: GET http://localhost:4200/api/user/:userId/totalSum
  * Authorization Bearer Token NEEDED