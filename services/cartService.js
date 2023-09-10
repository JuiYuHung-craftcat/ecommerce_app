const createError = require("http-errors");
const CartModel = require("../models/cart");
const CartItemModel = require("../models/cartItem");
const OrderModel = require("../models/order");
const ProductModel = require("../models/product");
const moment = require("moment");

module.exports = class CartService {
  static async create(data) {
    try {
      data.createdTime = moment.utc().toISOString();
      const cart = await CartModel.create(data);
      return cart;
    } catch (err) {
      throw createError(500, err);
    }
  }

  static async loadCart(userId) {
    try {
      // Load cart based on userId
      const cart = await CartModel.findOneByUser(userId);

      // Load cart items based on cart ID
      const items = await CartItemModel.find(cart.id);
      cart.items = items;

      return cart;
    } catch (err) {
      throw createError(500, err);
    }
  }

  static async addItem(userId, item) {
    try {
      // Load cart based on userId
      const cart = await CartModel.findOneByUser(userId);

      // Create cart item
      const cartItem = await CartItemModel.create({ cartId: cart.id, ...item });
      return cartItem;
    } catch (err) {
      throw createError(500, err);
    }
  }

  static async removeItem(cartItemId) {
    try {
      // Remove cart item by ID
      const cartItem = await CartItemModel.delete(cartItemId);
      return cartItem;
    } catch (err) {
      throw createError(500, err);
    }
  }

  static async updateItem(cartItemId, data) {
    try {
      // Update cart item by ID
      const cartItem = await CartItemModel.update(cartItemId, data);
      return cartItem;
    } catch (err) {
      throw createError(500, err);
    }
  }

  static async checkout(cartId, userId) {
    try {
      // Load cart items
      const cartItems = await CartItemModel.find(cartId);
      // Generate total from items
      const total = cartItems.reduce((total, item) => {
        return (total += Number(item.price));
      }, 0);

      // Create initial order
      const order = await OrderModel.create({
        items: cartItems,
        total: total,
        status: "NOT PAYED",
        userId: userId,
        updatedTime: null,
      });
      // Stripe Payment (Optional)

      // Update the order
      order.status = "FINISHED";
      const finishedOrder = await OrderModel.update(order);

      return finishedOrder;
    } catch (err) {
      throw createError(500, err);
    }
  }
};
