const createError = require("http-errors");
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");

module.exports = class AuthService {
  static async register(data) {
    const { email } = data;

    try {
      // Check if user already exists
      const user = await UserModel.findOneByEmail(email);

      // If user already exists, reject
      if (user) {
        throw createError(409, "Email already in use");
      }

      // Create new user record
      return await UserModel.create(data);
    } catch (err) {
      throw createError(500, err);
    }
  }

  static async login(data) {
    const { email, password } = data;
    try {
      // Check if user exists
      const user = await UserModel.findOneByEmail(email);
      if (!user) {
        console.log("User Not Found");
        throw createError(401, "Incorrect username");
      }

      // Check for matching passwords
      const matchFound = await bcrypt.compare(password, user.password);
      if (!matchFound) {
        console.log("Incorrect Password");
        throw createError(401, "Incorrect password");
      }
      console.log("Loggin Successfully");
      return user;
    } catch (err) {
      throw createError(500, err);
    }
  }
};
