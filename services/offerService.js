const {userRepository} = require("../repositories/userRepository");
const {tenderRepository} = require("../repositories/tenderRepository");
const {offerRepository} = require("../repositories/offerRepository");


class OfferService {
  async placeOffer(userId, tenderId, amount){
    try {
      const user = await userRepository.findOneById(userId);
      if (!user || user.balance < amount) {
        throw new Error('Insufficient balance');
      }

      const tender = await tenderRepository.findOneById(userId);
      if (!tender || !tender.isActive) throw new Error('Tender not found or not active');
      if (tender.userId === userId) throw new Error('Cannot offer on your own tender');

      const currentPrice = tender.currentPrice || tender.startingPrice;
      if (amount <= currentPrice) {
        throw new Error('Offer must be higher than current price');
      }

      const offerPayload = {userId, tenderId, amount};
      await offerRepository.create(offerPayload);
    }
    catch (err) {
      console.error(err);
      throw err;
    }
  }
}

module.exports.offerService = new OfferService();