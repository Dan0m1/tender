class TenderService {
    constructor({userRepository, tenderRepository, offerRepository}) {
        this.userRepository = userRepository;
        this.tenderRepository = tenderRepository;
        this.offerRepository = offerRepository;
    }


    async getAllTenders() {
        let tenders = await this.tenderRepository.getAllTenders();
        if (!tenders) {
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
        } catch (err) {
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
        } catch (err) {
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

            const offer = await this.offerRepository.getHighestActiveOfferByTenderId(tender.id)
            if (!offer) {
                return this.tenderRepository.updateTenderIsActive(tender.id, false);
            }

            const potentialWinner = await this.userRepository.findOneById(offer.userId);
            console.log(potentialWinner, offer);
            if (potentialWinner.balance >= offer.amount) {
                return Promise.all([
                    this.tenderRepository.updateTenderWinner(tender.id, offer.userId),
                    this.userRepository.changeUserFundsByDelta(offer.userId, -offer.amount),
                    this.tenderRepository.updateTenderIsActive(tender.id, false),
                ])
            }

            const allOffers = await this.offerRepository.getAllActiveOffersByTenderId(tender.id);
            if (allOffers.length === 1) {
                return Promise.all([
                        this.tenderRepository.updateTenderCurrentPrice(tender.id, tender.startingPrice),
                        this.offerRepository.updateOfferIsActive(allOffers[0].id, false)
                    ]
                );
            }

            let users = []
            for (let i = 1; i < allOffers.length; i++) {
                const currentOffer = allOffers[i];
                let currentOfferUser = users.find(user => user.id === currentOffer.userId);
                if (!currentOfferUser) {
                    currentOfferUser = await this.userRepository.findOneById(currentOffer.userId)
                }
                if (currentOfferUser.balance >= currentOffer.amount) {
                    return this.tenderRepository.updateTenderCurrentPrice(tender.id, currentOffer.amount);
                }
                await this.offerRepository.updateOfferIsActive(currentOffer.id, false);
                users.push(currentOfferUser);
                if (i === allOffers.length - 1) {
                    return this.tenderRepository.updateTenderCurrentPrice(tender.id, tender.startingPrice);
                }
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}


module.exports = TenderService;
