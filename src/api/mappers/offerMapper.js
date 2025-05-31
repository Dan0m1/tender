const Offer = require("../../db/models/offerModel");

class OfferMapper {
    async map(offer) {
        if(!offer) return null;
        return new Offer(
            parseInt(offer.id),
            parseInt(offer.userid),
            parseInt(offer.tenderid),
            parseFloat(offer.amount),
            offer.isactive,
            offer.createdat,
        )
    }
}

module.exports = OfferMapper;