class UserRepository {
    constructor({ sql, userMapper }) {
        this.sql = sql;
        this.userMapper = userMapper;
    }

    async findOneById(id){
        const result = await this.sql`SELECT * FROM Users WHERE id=${id}`;
        return this.userMapper.map(result[0]);
    }

    async findOneByUsername(username) {
        const result = await this.sql`SELECT * FROM Users WHERE username=${username}`;
        return this.userMapper.map(result[0]);
    }

    async createUser(user) {
        const result = await this.sql`INSERT INTO Users (username, password, balance) 
                VALUES (${user.username}, ${user.password}, ${user.balance})`;
        return this.userMapper.map(result[0]);
    }

    async updateUserFunds(userId, balance) {
        const result = await this.sql`UPDATE Users SET balance = ${balance} WHERE id = ${userId}`;
        return this.userMapper.map(result[0]);
    }

    async changeUserFundsByDelta(userId, delta) {
        const result = await this.sql`UPDATE Users SET balance = balance + ${delta} WHERE id = ${userId}`;
        return this.userMapper.map(result[0]);
    }
}

module.exports = UserRepository;