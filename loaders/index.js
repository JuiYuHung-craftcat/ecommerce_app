const expressLoader = require("./express");
const passportLoader = require("./passport");
const routeLoader = require("../routes");
const swaggerLoader = require("./swagger");

module.exports = async (app) => {
  // Load Express middlewares
  expressLoader(app);

  // Load Passport middleware
  const passport = passportLoader(app);

  // Load route handlers
  routeLoader(app, passport);

  // Load swagger
  swaggerLoader(app);

  // Error handlers
  app.use((err, req, res, next) => {
    const { message, status } = err;
    return res.status(status).send({ message });
  });
};
