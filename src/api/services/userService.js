const User = require('../../db/models/userModel');
const bcrypt = require('bcryptjs');

class UserService {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }


  async getUserById(id) {
    return this.userRepository.findOneById(id);
  }


  async getUserByUsername(username) {
    return this.userRepository.findOneByUsername(username);
  }


  async createUser(username, password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User(0, username, hashedPassword, 0);
    await this.userRepository.createUser(user);
  }


  async changeUserFundsByDelta(userId, delta) {
    const user = await this.userRepository.findOneById(userId);

    if (!user) {
      throw new Error('User does not exist');
    }
    try {
      await this.userRepository.changeUserFundsByDelta(user.id, delta);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}


module.exports = UserService;