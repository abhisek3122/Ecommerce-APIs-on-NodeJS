### WISHLIST API and Details
* Remove from wishlist API
  * Endpoint: DELETE http://localhost:4200/api/user/removeFromWishlist
  * Request Headers: Content-Type "application/json"<br /> ```{"productId":"b85ff3c6-65fe-4812-b337-54ad07f43e16"}```
  * Authorization Bearer Token NEEDED
* Add to wishlist API
  * Endpoint: POST http://localhost:4200/api/user/:userId/addItemToWishlist
  * Request Headers: Content-Type "application/json"<br /> ```{"productId":"b85ff3c6-65fe-4812-b337-54ad07f43e16"}```
  * Authorization Bearer Token NEEDED
* Get list of wishlist API
  * Endpoint: POST http://localhost:4200/api/user/getWishlistItems/:userId
  * Authorization Bearer Token NEEDED