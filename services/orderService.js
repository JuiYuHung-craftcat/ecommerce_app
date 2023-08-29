const createError = require("http-errors");
const OrderModel = require("../models/order");

module.exports = class OrderService {
  static async create(data) {
    try {
      const order = await OrderModel.create(data);
      return order;
    } catch (err) {
      throw createError(500, err);
    }
  }

  static async list(userId) {
    try {
      // Load orders based on userId
      const orders = await OrderModel.findByUser(userId);
      return orders;
    } catch (err) {
      throw createError(500, err);
    }
  }

  static async findById(orderId) {
    try {
      // Load order based on ID
      const order = await OrderModel.findById(orderId);
      return order;
    } catch (err) {
      throw createError(500, err);
    }
  }
};
