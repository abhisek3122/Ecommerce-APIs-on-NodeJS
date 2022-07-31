### ADMIN API and Details
* Get users based on roles API
  * Endpoint: GET http://localhost:4200/api/secret/admin/:userId/:rolee
  * Authorization Bearer Token NEEDED
* Delete user API
  * Endpoint: DELETE http://localhost:4200/api/secret/admin/:userId/delete
  * Request Headers: Content-Type "application/json"<br /> ```{"userId":"5ff2b89c6ac9f72a97517f29"}```
  * Authorization Bearer Token NEEDED