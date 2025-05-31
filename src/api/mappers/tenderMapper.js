const Tender = require('../../db/models/tenderModel')

class TenderMapper {
    async map(tender) {
        if(!tender) return null;
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
}

module.exports = TenderMapper;