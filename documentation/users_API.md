### USER API and Details
* Register user API
  * Endpoint: POST http://localhost:4200/api/user/register
  * Request Headers: Content-Type "application/json"<br /> ```{"name": "test", "rolee": 2, "email": "seller@test.com", "password": "test", "contactNumber": "1231213123"}```
  * Rolee indicates the privilege, 1 - Buyer  2 - Seller  0 - Admin
* Login API
  * Endpoint: POST http://localhost:4200/api/user/login
  * Request Headers: Content-Type "application/json"<br /> ```{"email":"buyer@test.com","password":"test"}```
  * If the given credentials are correct, JWT token will be assigned and stored in browser cookie [token]
* Get user profile details API
  * Endpoint: GET http://localhost:4200/api/user/:userId/getUserProfile
  * Request Headers: Content-Type "application/json" [Exclude in GET request]<br />
  * Authorization Bearer Token NEEDED
* Update profile details API
  * Endpoint: PUT http://localhost:4200/api/user/:userId/updateUserProfile
  * Request Headers: Content-Type "application/json"<br /> ```{"address": "ABC city"}```
  * Authorization Bearer Token NEEDED
* Logout API
  * Endpoint: POST http://localhost:4200/api/user/logout
  * Removes and deletes the cookie assigned [token]

