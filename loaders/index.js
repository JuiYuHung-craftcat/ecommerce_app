const expressLoader = require("./express");
const passportLoader = require("./passport");

module.exports = async (app) => {
  // Load Express middlewares
  await expressLoader(app);

  // Load Passport middleware
  const passport = await passportLoader(app);
};
