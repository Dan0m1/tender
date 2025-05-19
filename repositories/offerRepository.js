const {sql} = require('../db/sql');

class OfferRepository {
    async create(offer) {
        const { userId, tenderId, amount } = offer;
        return sql`INSERT INTO Offers (userId, tenderId, amount, createdAt)
                    VALUES (${userId}, ${tenderId}, ${amount}, CURRENT_TIMESTAMP)`
    }
}

module.exports.offerRepository = new OfferRepository();