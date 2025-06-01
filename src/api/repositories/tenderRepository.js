class TenderRepository {
    constructor({ userRepository, tenderMapper, sql }) {
        this.userRepository = userRepository;
        this.sql = sql;
        this.tenderMapper = tenderMapper;
    }

    async getAllTenders() {
        const result =  await this.sql`SELECT * FROM Tenders`;
        return Promise.all(result.map(tender => this.tenderMapper.map(tender)))
    }

    async findOneById(id){
        const result = await this.sql`SELECT * FROM Tenders WHERE id=${id}`;
        return this.tenderMapper.map(result[0]);
    }

    async createTender(tender){
        const {title, startingPrice, description, userId} = tender;
        return this.sql`INSERT INTO Tenders (title, startingPrice, description, userId)
                 VALUES (${title}, ${startingPrice}, ${description}, ${userId})`;
    }

    async createTenderAndTakeTax(tender, userId, newBalance){
        return this.sql.begin(async sql => {
            await this.userRepository.updateUserFunds(userId, newBalance);
            await this.createTender(tender);
        })
    }

    async updateTenderIsActive(tenderId, isActive){
        return this.sql`UPDATE Tenders SET isActive = ${isActive} WHERE id = ${tenderId}`;
    }

    async updateTenderIsHidden(tenderId, isHidden){
        return this.sql`UPDATE Tenders SET isHidden = ${isHidden} WHERE id = ${tenderId}`;
    }

    async updateTenderWinner(tenderId, userId) {
        return this.sql`UPDATE Tenders SET winnerId = ${userId} WHERE id = ${tenderId}`;
    }

    async updateTenderCurrentPrice(tenderId, currentPrice) {
        return this.sql`UPDATE Tenders SET currentPrice = ${currentPrice} WHERE id = ${tenderId}`;
    }

    async deleteById(id) {
        return this.sql`DELETE FROM Tenders WHERE id = ${id}`;
    }
}

module.exports= TenderRepository;