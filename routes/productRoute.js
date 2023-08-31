const express = require("express");
const router = express.Router();
const ProductService = require("../services/productService");

module.exports = (app) => {
  app.use("/products", router);

  router.get("/", async (req, res, next) => {
    try {
      const response = await ProductService.list();
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });

  router.get(":/productId", async (req, res, next) => {
    try {
      const { productId } = req.params;
      const response = await ProductService.get(productId);
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  });
};
