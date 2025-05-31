class OfferRepository {
    constructor({ sql, offerMapper }) {
        this.sql = sql;
        this.offerMapper = offerMapper;
    }

    async createOffer(offer) {
        const { userId, tenderId, amount } = offer;
        return this.sql`INSERT INTO Offers (userId, tenderId, amount, createdAt)
                    VALUES (${userId}, ${tenderId}, ${amount}, CURRENT_TIMESTAMP)`
    }

    async getAllActiveOffersByTenderId(tenderId) {
        const result = await this.sql`SELECT * FROM Offers WHERE tenderId = ${tenderId} AND isActive = true ORDER BY amount DESC`;
        return Promise.all(result.map(async (offer) => await this.offerMapper.map(offer)))
    }

    async getHighestActiveOfferByTenderId(tenderId) {
        const result = await this.sql`SELECT * FROM Offers WHERE tenderId = ${tenderId} AND isActive = true ORDER BY amount DESC LIMIT 1`;
        return this.offerMapper.map(result[0]);
    }

    async updateOfferIsActive(offerId, isActive){
        return this.sql`UPDATE Offers SET isActive = ${isActive} WHERE id = ${offerId}`;
    }
}

module.exports = OfferRepository;