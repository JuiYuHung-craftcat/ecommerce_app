const express = require("express");
const router = express.Router();
const AuthService = require("../services/authService");

module.exports = (app, passport) => {
  app.use("/auth", router);

  // Registration Endpoint
  router.post("/register", async (req, res, next) => {
    try {
      const data = req.body;
      const response = await AuthService.register(data);
      res.status(201).send(response);
    } catch (err) {
      next(err);
    }
  });

  // Login Endpoint
  router.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/" }),
    async (req, res, next) => {
      res.redirect("/");
    }
  );
};
