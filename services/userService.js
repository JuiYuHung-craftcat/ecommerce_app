const createError = require("http-errors");
const UserModel = require("../models/user");

module.exports = class UserService {
  static async get(data) {
    const { id } = data;

    try {
      // Check if the user already exists
      const user = await UserModel.findOneById(id);

      // If user doesn't exist, reject
      if (!user) {
        throw createError(404, "User record not found");
      }

      return user;
    } catch (err) {
      throw err;
    }
  }

  static async update(data) {
    const { id } = data;
    try {
      // Check if the user already exists
      const user = await UserModel.findOneById(id);

      // If user doesn't exist, reject
      if (!user) {
        throw createError(404, "User id not found for update");
      }

      // Update the user data
      const updatedUser = await UserModel.update(data);

      return updatedUser;
    } catch (err) {
      throw err;
    }
  }
};
