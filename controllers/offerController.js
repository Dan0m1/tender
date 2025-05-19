const {offerService} = require('../services/offerService');


class OfferController {
  async placeOffer(req, res) {
    const tenderId = parseInt(req.params.tenderId);
    const amount = parseFloat(req.body.amount);
    const userId = req.session?.user?.id;

    if (!userId) {
      req.session.message = 'Login to place a offer';
      return res.redirect(`/tenders/${tenderId}`);
    }

    try {
      await offerService.placeOffer(userId, tenderId, amount);
      req.session.message = 'Offer placed';
    } catch (err) {
      req.session.message = `Error: ${err.message}`;
    }

    res.redirect(`/tenders/${tenderId}`);
  }
}

module.exports.offerController = new OfferController();