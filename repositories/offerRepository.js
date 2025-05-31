class OfferRepository {
    constructor({ sql, offerMapper }) {
        this.sql = sql;
        this.offerMapper = offerMapper;
    }

    async create(offer) {
        const { userId, tenderId, amount } = offer;
        return this.sql`INSERT INTO Offers (userId, tenderId, amount, createdAt)
                    VALUES (${userId}, ${tenderId}, ${amount}, CURRENT_TIMESTAMP)`
    }

    async getHighestOfferByTenderId(tenderId) {
        const result = await this.sql`SELECT * FROM Offers WHERE tenderId = ${tenderId} ORDER BY amount DESC LIMIT 1`;
        return this.offerMapper.map(result[0]);
    }
}

module.exports = OfferRepository;