const express = require("express");
const router = express.Router();
const OrderService = require("../services/orderService");

module.exports = (app) => {
  app.use("/orders", router);

  const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/auth");
  };

  router.get("/", ensureAuthenticated, async (req, res, next) => {
    try {
      const { id } = req.user;
      const response = await OrderService.list(id);
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.get("/:orderId", ensureAuthenticated, async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const response = await OrderService.findById(orderId);
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });
};
