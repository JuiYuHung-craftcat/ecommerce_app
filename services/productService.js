const createError = require("http-errors");
const ProductModel = require("../models/product");

module.exports = class ProductService {
  static async list() {
    try {
      // Load products
      const products = await ProductModel.find();

      return products;
    } catch (err) {
      throw err;
    }
  }

  static async get(id) {
    try {
      // Check if the product exists
      const product = await ProductModel.findOne(id);

      if (!product) {
        throw createError(404, "Product not found");
      }

      return product;
    } catch (err) {
      throw err;
    }
  }
};
