const db = require("../db");
const moment = require("moment");
const pgp = require("pg-promise")({ capSQL: true });
const OrderItemModel = require("./orderItem");

module.exports = class OrderModel {
  /**
   *  Creates a new order for a user
   *  @param  {Object}       data [Order data]
   *  @return {Object|null}       [Created order record]
   */
  static async create(data) {
    try {
      const { items, ...order } = data;

      // Generate updatedTime
      order.updatedTime = moment.utc().toISOString();

      // Generate SQL statement - using helper for dynamic parameter injection
      const statement =
        pgp.helpers.insert(order, null, "orders") + "RETURNING *";

      // Execute SQL statement
      const result = await db.query(statement);

      if (result.rows?.length) {
        // Add new information generated in database (id) to Order instance
        Object.assign(data, result.rows[0]);

        // Create order items
        data.items.map((item) => {
          item.orderId = data.id;
          OrderItemModel.create(item);
        });

        return result.rows[0];
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Updates an order for a user
   * @param   {Objct}       id    [Order ID]
   * @param   {Object}      data  [Order data to update]
   * @return  {Object|null}       [Updated order record]
   */
  static async update(data) {
    try {
      // Generate updatedTime
      data.updatedTime = moment.utc().toISOString();

      // Generaate SQL statement - using helper for dynamic parameter injection
      const condition = pgp.as.format("WHERE id = ${id} RETURNING *", {
        id: data.id,
      });
      const statement = pgp.helpers.update(data, null, "orders") + condition;

      // Execute SQL statement
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
   * Loads orders for a user
   * @param   {number}  userId  [User ID]
   * @return  {Array}           [Order records]
   */
  static async findByUser(userId) {
    try {
      // Generate SQL statement
      const statement = `SELECT * FROM orders WHERE userId = $1`;
      const values = [userId];

      // Execute SQL statement
      const result = await db.query(statement, values);

      if (result.rows.length) {
        return result.rows[0];
      }

      return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Retrieve order by ID
   * @param   {number}        orderId [Order ID]
   * @return  {Object|null}           [Order record]
   */
  static async findById(orderId) {
    try {
      // Generate SQL statement
      const statement = `SELECT * FROM orders WHERE id = $1`;
      const values = [orderId];

      // Execute SQL statement
      const result = await db.query(statement, values);

      if (result.rows?.length) {
        return result.rows[0];
      }
      return null;
    } catch (err) {
      throw new Error(err);
    }
  }
};
