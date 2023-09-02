const express = require("express");
const router = express.Router();
const UserService = require("../services/UserService");

module.exports = (app) => {
  app.use("/users", router);

  const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/auth");
  };

  router.get("/:userId", ensureAuthenticated, async (req, res, next) => {
    try {
      const { userId } = req.params;
      const response = await UserService.get({ id: userId });
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.put("/:userId", ensureAuthenticated, async (req, res, next) => {
    try {
      const { userId } = req.params;
      const data = req.body;
      const response = await UserService.update({ id: userId, ...data });
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });
};
