const db = require("../db");
const moment = require("moment");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = class CartModel {
  /**
   *  Creates a new cart for a user
   *  @param  {Object}      data  [Cart data]
   *  @return {Object|null}       [Created cart record]
   */
  static async create(data) {
    try {
      // Generate SQL statement - using helper for dynamic parameter injection
      const statement = pgp.helpers.insert(data, null, "carts") + "RETURNING *";

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
   *  Loads a cart by User ID
   *  @param  {number}      id  [User ID]
   *  @return {Object|null}     [Cart record]
   */
  static async findOneByUser(userId) {
    try {
      // Generate SQL statement
      const statement = `SELECT * FROM carts WHERE "userId" = $1`;
      const values = [userId];

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

  /**
   *  Loads a cart by ID
   *  @param  {number}      id  [Cart ID]
   *  @return {Object|null}     [Cart record]
   */
  static async findOneById(id) {
    try {
      // Generate SQL statement
      const statement = `SELECT * FROM carts WHERE id = $1`;
      const values = [id];

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
