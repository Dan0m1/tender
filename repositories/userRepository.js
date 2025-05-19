const {sql} = require('../db/sql');

class UserRepository {
    async findOneById(id){
        const result = await sql`SELECT * FROM Users WHERE id=${id}`;
        return result[0];
    }

    async findOneByUsername(username) {
        const result = await sql`SELECT * FROM Users WHERE username=${username}`;
        return result[0];
    }

    async createUser(user) {
        const result = await sql`INSERT INTO Users (username, password, balance) 
                VALUES (${user.username}, ${user.password}, ${user.balance})`;
        return result[0];
    }

    async updateUserFunds(userId, balance) {
        const result = await sql`UPDATE Users SET balance = ${balance} WHERE id = ${userId}`;
        return result[0];
    }
}

module.exports.userRepository = new UserRepository()