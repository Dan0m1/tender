const express = require('express');
const router = express.Router();
const container = require('../../container');

const offerController = container.resolve('offerController');

router.post('/:tenderId/offer', (req,res) => offerController.placeOffer(req, res));

module.exports = router;