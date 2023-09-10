const db = require("../db");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = class CartItemModel {
  /**
   * Creates a new cart line item
   * @param   {Object}      data  [Cart item data]
   * @return  {Object|null}       [Created  cart item]
   */
  static async create(data) {
    try {
      // Generate SQL statement - using helper for dynamic paramter injection
      const statement =
        pgp.helpers.insert(data, null, "cartItems") + "RETURNING *";

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
   * Updates existing cart item
   * @param   {Object}    data  [Cart item data]
   * @param   {Object}    id    [Cart item id]
   * @return  {Object|null}     [Updated cart item]
   */
  static async update(id, data) {
    try {
      // Generate SQL statement - using helper for dynamic parameter injection
      const condition = pgp.as.format(` WHERE id = ${id} RETURNING *`, { id });
      const statement = pgp.helpers.update(data, null, "cartItems") + condition;
      console.log(statement);
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
   * Retrieve cart items for a cart
   * @param   {Object}   cartId   [Cart ID]
   * @return  {Promise<Array>}             [Created cart item]
   */
  static async find(cartId) {
    try {
      // Generate SQL statement
      const statement = `SELECT "cartItems".quantity AS cartItem_quantity, "cartItems".id AS cartItem_id, products.*
                         FROM "cartItems"
                         INNER JOIN products ON products.id = "cartItems"."productId"
                         WHERE "cartItems"."cartId" = $1`;
      const values = [cartId];

      // Execute SQL statement
      const result = await db.query(statement, values);

      if (result.rows?.length) {
        return result.rows;
      }

      return [];
    } catch (err) {
      throw new Error(err);
    }
  }
  /**
   * Deletes a cart line item
   * @param   {Object}    id  [Cart item ID]
   * @return  {Object|null}   [Deleted cart item]
   */
  static async delete(id) {
    try {
      // Generate SQL statement
      const statement = `DELETE FROM "cartItems" WHERE id = $1 RETURNING *`;
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
