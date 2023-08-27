const db = require("../db");
const moment = require("moment");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = class OrderItemModel {
  constructor(data = {}) {
    this.created = data.created || moment.utc().toISOString();
    this.modified = moment.utc().toISOString();
    this.quantity = data.quantity || 1;
    this.orderId = data.orderId || null;
    this.productId = data.productId;
  }

  /**
   *  Create a new oder item
   *  @return  {Object|null}          [Created order item]
   */
  async create() {
    try {
      // Generate SQL statement - using helper for dynamic parameter injection
      const statement =
        pgp.helpers.insert(this, null, "orderItems") + "RETURNING *";

      //Execute SQL statement
      const result = await db.query(statement);

      if (result.rows?.length) {
        return result.rows[0];
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   *  Retrieve order items for an order
   *  @param  {Object} orderId  [Order ID]
   *  @return {Array}           [List order items]
   */
  static async find(orderId) {
    try {
      // Generate SQL statement
      const statement = `SELECT orderItems.quantity, products.* 
                         FROM orderItems 
                         INNER JOIN prouects ON producst.id = orderItems.productId 
                         WHERE orderId = $1`;
      const values = [orderId];

      //Execute SQL statement
      const result = await db.query(statement, values);

      if (result.rows?.length) {
        return result.rows;
      }

      return [];
    } catch (err) {
      throw new Error(err);
    }
  }
};
