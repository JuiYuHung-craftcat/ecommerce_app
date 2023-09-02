const express = require("express");
const router = express.Router();
const CartService = require("../services/cartService");

module.exports = (app) => {
  app.use("/carts", router);

  const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/auth");
  };

  router.get("/mine", ensureAuthenticated, async (req, res, next) => {
    try {
      const { id } = req.user;
      const response = await CartService.loadCart(id);
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.post("/mine", ensureAuthenticated, async (req, res, next) => {
    try {
      const { id } = req.user;
      const response = await CartService.create({ userId: id });

      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.post("/mine/items", async (req, res, next) => {
    try {
      const { id } = req.user;
      const data = req.body;
      const response = await CartService.addItem(id, data);
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.put("/mine/items/:cartItemId", async (req, res, next) => {
    try {
      const { cartItemId } = req.params;
      const data = req.body;
      const response = await CartService.updateItem(cartItemId, data);
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.delete("/mine/items/:cartItemId", async (req, res, next) => {
    try {
      const { cartItemId } = req.params;
      const response = await CartService.removeItem(cartItemId);
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.post("/mine/checkout", async (req, res, next) => {
    try {
      const { id } = req.user;
      const { cartId } = req.body;
      const response = await CartService.checkout(cartId, id);
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });
};
