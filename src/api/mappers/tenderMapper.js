const Tender = require('../../db/models/tenderModel')

class TenderMapper {
    map(tender) {
        if(!tender) return null;
        if("startingprice" in tender)
            return this.#mapFromDB(tender)
        return this.#mapFromDTO(tender)
    }

    #mapFromDB(tender) {
        return new Tender(
            parseInt(tender.id),
            tender.title,
            parseFloat(tender.startingprice),
            tender.description,
            parseInt(tender.userid),
            parseFloat(tender.currentprice),
            parseInt(tender.winnerid),
            tender.isactive,
            tender.ishidden,
        )
    }
    #mapFromDTO(tender) {
        return new Tender(
            parseInt(tender.id),
            tender.title,
            parseFloat(tender.startingPrice),
            tender.description,
            parseInt(tender.userId),
            parseFloat(tender.currentPrice),
            parseInt(tender.winnerId),
            tender.isActive,
            tender.isHidden,
        )
    }
}

module.exports = TenderMapper;