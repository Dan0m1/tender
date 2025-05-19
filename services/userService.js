
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const {userRepository} = require("../repositories/userRepository");

class UserService {
  async getUserById(id) {
    return userRepository.findOneById(id);
  }

  async getUserByUsername(username) {
    return userRepository.findOneByUsername(username);
  }

  async createUser(username, password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User(0, username, hashedPassword, 0);
    await userRepository.createUser(user);
  }

  async changeFundsByDelta(userId, delta) {
    const user = await userRepository.findOneById(userId);

    if (!user) {
      throw new Error('User does not exist');
    }
    try {
      const { id, balance } = user;
      await userRepository.updateUserFunds(id, parseFloat(balance) + delta);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

module.exports.userService = new UserService();