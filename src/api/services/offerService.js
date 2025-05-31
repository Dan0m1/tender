class OfferService {
    constructor({userRepository, tenderRepository, offerRepository}) {
        this.userRepository = userRepository;
        this.tenderRepository = tenderRepository;
        this.offerRepository = offerRepository;
    }


    async placeOffer(userId, tenderId, amount) {
        try {
            const user = await this.userRepository.findOneById(userId);
            if (!user || user.balance < amount) {
                throw new Error('Insufficient balance');
            }

            const tender = await this.tenderRepository.findOneById(tenderId);
            if (!tender || !tender.isActive) throw new Error('Tender not found or not active');
            if (tender.userId === userId) throw new Error('Cannot offer on your own tender');

            const currentPrice = tender.currentPrice || tender.startingPrice;
            if (amount <= currentPrice) {
                throw new Error('Offer must be higher than current price');
            }

            const offerPayload = {userId, tenderId, amount};
            await this.offerRepository.createOffer(offerPayload);
            await this.tenderRepository.updateTenderCurrentPrice(tenderId, amount);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

}


module.exports = OfferService;