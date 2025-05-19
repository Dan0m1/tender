const {userService} = require('./userService');
const {tenderRepository} = require('../repositories/tenderRepository');
const {userRepository} = require("../repositories/userRepository");

class TenderService {
  async getAllTenders() {
    let tenders = await tenderRepository.getAllTenders();
    if (!tenders){
      tenders = []
    }
    return tenders;
  }

  async getTenderById(id) {
    return tenderRepository.findOneById(id);
  }

  async createTender(tender) {
    const TAX = 25;
    try {
      const user = await userService.getUserById(tender.userId);
      if (!user || user.balance < TAX)
        throw new Error('Insufficient funds');
      await tenderRepository.createTenderAndTakeTax(tender, user.id, user.balance - TAX);
    }
    catch (err) {
      console.error(err);
      throw err;
    }
  }

  async deleteTender(id, userId) {
    try {
      const tender = await tenderRepository.findOneById(id);
      if (!tender || tender.userId !== userId)
        throw new Error("Something went wrong");

      if (!tender.isActive) {
        const highestOffer = await offerRepository.getHighestOfferByTenderId(tender.id);
        if (highestOffer) {
          await userRepository.updateUserFunds(tender.userId, highestOffer.amount);
        }
      }
      await tenderRepository.deleteById(tender.id)
    }
    catch (err) {
      console.error(err);
      throw err;
    }
  }

  async closeTender(tenderId, userId) {
    try {
      const tender = await tenderRepository.findOneById(tenderId);
      if (!tender || tender.userId !== userId)
        throw new Error("Something went wrong");
      if (!tender.isActive) {
        throw new Error("Already closed");
      }

      const offer = await offerRepository.getHighestOfferByTenderId(tender.id)
      if (offer) {
        await tenderRepository.updateTenderWinner(tender.id, offer.userId);
        await userRepository.updateUserFunds(offer.userId, -offer.amount)
      }
      await tenderRepository.updateTenderIsActive(tender.id, false);
    }
    catch (err) {
      console.error(err);
      throw err;
    }
  }
}

module.exports.tenderService = new TenderService();
