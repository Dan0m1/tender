const express = require('express');
const router = express.Router();
const container = require('../container');

const userController = container.resolve('userController');

router.get('/login', (req, res) => userController.getLogin(req,res));
router.post('/login', (req, res) => userController.postLogin(req,res));
router.get('/register', (req, res) => userController.getRegister(req,res));
router.post('/register', (req, res) => userController.postRegister(req,res));
router.get('/logout', (req, res) => userController.logout(req,res));
router.post('/add-funds', (req, res) => userController.addFunds(req,res));

module.exports = router;