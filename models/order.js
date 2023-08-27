const db = require("../db");
const moment = require("moment");
const pgp = require("pg-promise")({ capSQL: true });
const OrderItemModel = require("./orderItem");

module.exports = class OrderModel {
  constructor(data = {}) {
    this.total = data.total || 0;
    this.status = data.status || "PENDING";
    this.userId = data.userId;
    this.created = data.created || moment.utc().toISOString();
    this.modified = moment.utc().toISOString();
    this.items = data.items || [];
  }

  addItems(items) {
    this.items = items.map((item) => new OrderItemModel(item));
  }

  /**
   *  Creates a new order for a user
   *  @return {Object|null}   [Created order record]
   */
  async create() {
    try {
      const { items, ...order } = this;

      // Generate SQL statement - using helper for dynamic parameter injection
      const statement =
        pgp.helpers.insert(order, null, "orders") + "RETURNING *";

      // Execute SQL statement
      const result = await db.query(statement);

      if (result.rows?.length) {
        // Add new information generated in database (id) to Order instance
        Object.assign(this, result.rows[0]);

        // Create order items
        this.items.map((element) => {
          element.orderId = this.id;
          element.create();
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
  async update(data) {
    try {
      // Generaate SQL statement - using helper for dynamic parameter injection
      const condition = pgp.as.format("WHERE id = ${id} RETURNING *", {
        id: this.id,
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
