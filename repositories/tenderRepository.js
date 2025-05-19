const {sql}  = require( '../db/sql');
const {userRepository} = require('./userRepository');
const Tender = require("../models/tenderModel");

class TenderRepository {
    async getAllTenders() {
        return sql`SELECT * FROM Tenders`;
    }

    async findOneById(id){
        const result = await sql`SELECT * FROM Tenders WHERE id=${id}`;
        return result[0];
    }

    async createTender(tender){
        const {title, startingPrice, description, userId} = tender;
        return sql`INSERT INTO Tenders (title, startingPrice, description, userId)
                 VALUES (${title}, ${startingPrice}, ${description}, ${userId})`;
    }

    async createTenderAndTakeTax(tender, userId, newBalance){
        return sql.begin(async sql => {
            await userRepository.updateUserFunds(userId, newBalance);
            await this.createTender(tender);
        })
    }

    async updateTenderIsActive(tenderId, isActive){
        return sql`UPDATE Tenders SET isActive = ${isActive} WHERE id = ${tenderId}`;
    }

    async updateTenderWinner(tenderId, userId) {
        return sql`UPDATE Tenders SET winnerId = ${userId} WHERE tenderId = ${tenderId}`;
    }

    async deleteById(id) {
        return sql`DELETE FROM Tenders WHERE id = ${id}`;
    }
}

module.exports.tenderRepository = new TenderRepository();