const Tender = require('../models/tenderModel')

class TenderMapper {
    async map(tender) {
        if(!tender) return null;
        return new Tender(
            tender.id,
            tender.title,
            tender.startingprice,
            tender.description,
            tender.userid,
            tender.currentprice,
            tender.winnerid,
            tender.isactive,
            tender.ishidden,
        )
    }
}

module.exports = TenderMapper;