### PRODUCT API and Details
* Product addition API
  * Endpoint: POST http://localhost:4200/api/product/:userId/add
  * Request Headers: Content-Type "application/json"<br /> ```{"title": "New2","description": "ABC desp","price": "50","category": "ABC","color": "ABCD","quantity": "20"}```
  * Authorization Bearer Token NEEDED
* Get/List all products API
  * Endpoint: GET http://localhost:4200/api/product/:userId/all
  * Authorization Bearer Token NEEDED
* Product deletion API
  * Endpoint: DELETE http://localhost:4200/api/product/:userId/delete
  * Request Headers: Content-Type "application/json"<br /> ```{"productId":"16a989fe-b972-4b64-8ca7-24ca451629df"}```
  * Authorization Bearer Token NEEDED
* Product details - specific API
  * Endpoint: GET http://localhost:4200/api/product/:userId/details/:productId
  * Authorization Bearer Token NEEDED
* Product update API
  * Endpoint: PUT http://localhost:4200/api/product/:userId/update
  * Request Headers: Content-Type "application/json"<br /> ```{"productId":"123e0c61-6923-45b9-8285-486b2beb4c26","quantity":12}```
  * Authorization Bearer Token NEEDED
* Product image path API
  * Endpoint: GET http://localhost:4200/api/product/:userId/:productId/image
  * Authorization Bearer Token NEEDED
