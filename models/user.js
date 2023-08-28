const db = require("../db");
const moment = require("moment");
const bcrypt = require("bcrypt");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = class UserModel {
  /**
   *  Create a new user record
   *  @param  {Object}        data [User data]
   *  @return {Object|null}        [Created user record]
   */
  static async create(data) {
    try {
      // Encrypt password with saltround 10
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);
      data.password = hashedPassword;

      // Generate updatedTime
      data.updatedTime = moment.utc().toISOString();

      // Generate SQL statement - using helper for dynamic parameter injection
      const statement = pgp.helpers.insert(data, null, "users") + "RETURNING *";

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
   *  Update a user record
   *  @param  {Object}        data [User data]
   *  @param  {Object|null}        [Updated user record]
   */
  static async update(data) {
    try {
      const { id, ...params } = data;

      // Update modified
      params.modified = moment.utc().toISOString();

      // Encrypt updated password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(params.password, salt);
      params.password = hashedPassword;

      // Generate updatedTime
      data.updatedTime = moment.utc().toISOString();

      // Generate SQL statement - using helper for dynamic parameter injection
      const condition = pgp.as.format("WHERE id = ${id} RETURNING *", { id });
      const statement = pgp.helpers.update(params, null, "users") + condition;

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
   *  Finds a user record by email
   *  @param  {String}        email [Email address]
   *  @return {Object|null}         [User record]
   */
  static async findOneByEmail(email) {
    try {
      // Generate SQL statement
      const statement = `SELECT *
                         FROM users
                         WHERE email = $1`;
      const values = [email];

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
   *  Finds a user record by ID
   *  @param  {String}      id  [User ID]
   *  @return {Object|null}     [User Record]
   */
  static async findOneById(id) {
    try {
      // Generate SQL statement
      const statement = `SELECT *
                         FROM users
                         WHERE id = $1`;
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
