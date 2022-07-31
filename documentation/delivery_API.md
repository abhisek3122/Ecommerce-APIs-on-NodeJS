### ADMIN API and Details
* Get the delivery items - Buyer API
  * Endpoint: GET http://localhost:4200/api/:userId/1/deliveryItems
  * Authorization Bearer Token NEEDED
* Get the delivery items - Seller API
  * Endpoint: GET http://localhost:4200/api/:userId/2/deliveryItems
  * Authorization Bearer Token NEEDED
* Update delivery tracking API
  * Endpoint: PUT http://localhost:4200/api/:userId/:deliveryId/2/update
  * Request Headers: Content-Type "application/json"<br /> ```{"packedAndDespatch": "Yes", "shipped": "Yes", "delivered": "No"}```
  * Authorization Bearer Token NEEDED