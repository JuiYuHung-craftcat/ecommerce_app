const db = require("../db");
const moment = require("moment");
const bcrypt = require("bcrypt");
const pgp = require("pg-promise")({ capSQL: true });

module.exports = class UserModel {
  constructor(data = {}) {
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.password = data.password;
    this.created = data.created || moment.utc().toISOString();
    this.modified = moment.utc().toISOString();
  }

  /**
   *  Create a new user record
   *  @return {Object|null}      [Created user record]
   */
  async create() {
    try {
      // Encrypt password with saltround 10
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;

      // Generate SQL statement - using helper for dynamic parameter injection
      const statement = pgp.helpers.insert(this, null, "users") + "RETURNING *";

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
  async update(data) {
    try {
      const { id, ...params } = data;

      // Update modified
      params.modified = moment.utc().toISOString();

      // Encrypt updated password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(params.password, salt);
      params.password = hashedPassword;

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
  async findOneByEmail(email) {
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
  async findOneById(id) {
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
