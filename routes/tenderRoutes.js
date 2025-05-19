const express = require('express');
const router = express.Router();
const {tenderController} = require('../controllers/tenderController');

router.get('/', tenderController.listTenders);
router.get('/tenders/:id', tenderController.viewTender);
router.get('/create', tenderController.showCreateForm);
router.post('/create', tenderController.createTender);
router.post('/tenders/:id/delete', tenderController.deleteTender);
router.post('/tenders/:id/close', tenderController.closeTender);

module.exports = router;