const express = require('express');
const router = express.Router();
const container = require('../container');

const tenderController = container.resolve('tenderController');

router.get('/', (req, res) => tenderController.listTenders(req,res));
router.get('/tenders/:id', (req, res) => tenderController.viewTender(req,res));
router.get('/create', (req, res) => tenderController.showCreateForm(req,res));
router.post('/create', (req, res) => tenderController.createTender(req,res));
router.post('/tenders/:id/delete', (req, res) => tenderController.deleteTender(req,res));
router.post('/tenders/:id/close', (req, res) => tenderController.closeTender(req,res));

module.exports = router;