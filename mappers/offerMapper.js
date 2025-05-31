const Offer = require("../models/offerModel");

class OfferMapper {
    async map(offer) {
        if(!offer) return null;
        return new Offer(
            offer.id,
            offer.userid,
            offer.tenderid,
            offer.amount,
            offer.createdat,
        )
    }
}

module.exports = OfferMapper;