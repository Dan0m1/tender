class OfferController {
  constructor({ offerService }) {
    this.offerService = offerService;
  }

  async placeOffer(req, res) {
    const tenderId = parseInt(req.params.tenderId);
    const amount = parseFloat(req.body.amount);
    const userId = req.session?.user?.id;

    if (isNaN(amount) || amount <= 0) {
      req.session.message = 'Invalid amount';
      return res.redirect(`/tenders/${tenderId}`);
    }

    if (!userId) {
      req.session.message = 'Login to place an offer';
      return res.redirect(`/tenders/${tenderId}`);
    }

    try {
      await this.offerService.placeOffer(userId, tenderId, amount);
      req.session.message = 'Offer placed';
    } catch (err) {
      req.session.message = `Error: ${err.message}`;
    }

    res.redirect(`/tenders/${tenderId}`);
  }
}

module.exports = OfferController;