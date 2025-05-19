const {userService} = require('../services/userService');
const bcrypt = require('bcryptjs');

class UserController {
  getLogin(req, res) {
    res.render('login');
  }

  getRegister(req, res) {
    res.render('register');
  }

  async postRegister(req, res) {
    const { username, password } = req.body;
    const existingUser = await userService.getUserByUsername(username);
    if (existingUser) return res.render('register', { error: 'This username is already occupied.' });

    await userService.createUser(username, password);
    res.redirect('/login');
  }

  async postLogin(req, res) {
    const { username, password } = req.body;
    const user = await userService.getUserByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render('login', { error: 'Invalid credentials' });
    }
    req.session.user = { id: user.id, username: user.username };
    res.redirect('/');
  }

  logout(req, res) {
    req.session.destroy(() => res.redirect('/login'));
  }

  async addFunds(req, res) {
    if (!req.session.user) {
      req.session.message = 'Login to add funds';
      return res.redirect('/');
    }

    const userId = req.session.user.id;
    const amount = parseFloat(req.body.amount);
    try {
      await userService.changeFundsByDelta(userId, amount);
      req.session.message = 'Balance updated successfully';
    } catch (err) {
      req.session.message = `Error: ${err.message}`;
    }
    res.redirect('/');
  }
}

module.exports.userController = new UserController();