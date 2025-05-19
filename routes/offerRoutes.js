const express = require('express');
const router = express.Router();
const {offerController} = require('../controllers/offerController');

router.post('/:tenderId/offer', offerController.placeOffer);

module.exports = router;