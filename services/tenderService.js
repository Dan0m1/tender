class TenderService {
  constructor({ userRepository, tenderRepository, offerRepository }) {
    this.userRepository = userRepository;
    this.tenderRepository = tenderRepository;
    this.offerRepository = offerRepository;
  }

  async getAllTenders() {
    let tenders = await this.tenderRepository.getAllTenders();
    if (!tenders){
      tenders = []
    }
    return tenders;
  }

  async getTenderById(id) {
    return this.tenderRepository.findOneById(id);
  }

  async createTender(tender) {
    const TAX = 25;
    try {
      const user = await this.userRepository.findOneById(tender.userId);
      if (!user || user.balance < TAX)
        throw new Error('Insufficient funds');
      await this.tenderRepository.createTenderAndTakeTax(tender, user.id, user.balance - TAX);
    }
    catch (err) {
      console.error(err);
      throw err;
    }
  }

  async deleteTender(id, userId) {
    try {
      const tender = await this.tenderRepository.findOneById(id);
      if (!tender || tender.userId !== userId)
        throw new Error("Something went wrong");

      if (!tender.isActive) {
        const highestOffer = await this.offerRepository.getHighestOfferByTenderId(tender.id);
        if (highestOffer) {
          await this.userRepository.updateUserFunds(tender.userId, highestOffer.amount);
        }
      }
      await this.tenderRepository.updateTenderIsHidden(id, true);
    }
    catch (err) {
      console.error(err);
      throw err;
    }
  }

  async closeTender(tenderId, userId) {
    try {
      const tender = await this.tenderRepository.findOneById(tenderId);
      if (!tender || tender.userId !== userId)
        throw new Error("Something went wrong");
      if (!tender.isActive) {
        throw new Error("Already closed");
      }

      const offer = await this.offerRepository.getHighestOfferByTenderId(tender.id)
      console.log(offer);
      if (offer) {
        await this.tenderRepository.updateTenderWinner(tender.id, offer.userId);
        await this.userRepository.changeUserFundsByDelta(offer.userId, -offer.amount)
      }
      await this.tenderRepository.updateTenderIsActive(tender.id, false);
    }
    catch (err) {
      console.error(err);
      throw err;
    }
  }
}

module.exports = TenderService;
