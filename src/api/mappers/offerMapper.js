const Offer = require("../../db/models/offerModel");

class OfferMapper {
    map(offer) {
        if(!offer) return null;
        if("userid" in offer)
            return this.#mapFromDB(offer)
        return this.#mapFromDTO(offer)
    }

    #mapFromDB(offer) {
        return new Offer(
            parseInt(offer.id),
            parseInt(offer.userid),
            parseInt(offer.tenderid),
            parseFloat(offer.amount),
            offer.isactive,
            offer.createdat,
        )
    }
    #mapFromDTO(offer) {
        return new Offer(
            parseInt(offer.id),
            parseInt(offer.userId),
            parseInt(offer.tenderId),
            parseFloat(offer.amount),
            offer.isActive,
            offer.createdAt,
        )
    }
}

module.exports = OfferMapper;