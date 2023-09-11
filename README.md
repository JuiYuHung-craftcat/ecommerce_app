# Ecommerce Backend App

## Tech Stacks:

- Node.js
- Express.js
- PostgreSQL
- Swagger UI

## Setup:

1. Install Node.js
2. Install Postgre.app
3. Setup Postgre.app and initialize database
4. Based on example.env, create .env with your personal configuration
5. Run the following command to install package.\
   `npm install`
6. Run the following command to create table and insert product information for database.\
   `npm run create-db`
7. Run the following command to start the server.\
   `npm run start`
8. Open your browser and type **localhost:${your_PORT}/docs**.
9. There will be a swagger ui page for API document and testing.

## Description for API usage:

- Product related API can be accessed directly.
- User, cart, order related API can only be accessed after login.
- Need to regist with your email & password before login.
- The password will be hashed before storing into the database.
