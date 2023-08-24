const expressLoader = require("./express");

module.exports = async (app) => {
  // Load Express middlewares
  const expressApp = await expressLoader(app);

  // Load Passport middleware
};
