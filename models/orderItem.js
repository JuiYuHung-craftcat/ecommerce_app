const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = class OrderItemModel {
  /**
   *  Create a new oder item
   *  @param   {Object}       data    [Order item data]
   *  @return  {Object|null}          [Created order item]
   */
  static async create(data) {
    try {
      // Generate SQL statement - using helper for dynamic parameter injection
      const statement =
        pgp.helpers.insert(data, null, "orderItems") + "RETURNING *";

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
      const statement = `SELECT orderItems.quantity AS orderItems_quantity, products.* 
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
