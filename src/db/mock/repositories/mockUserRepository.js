const fs = require('node:fs');
const path = require('node:path');
const User = require('../../models/userModel');

class MockUserRepository {
    constructor({ userMapper }) {
        this.userMapper = userMapper;
        this.filePath = path.join(__dirname, '../data/users.json');
        this.users = []
        this.initDataSync();
        this.nextId = this.getNextId();
    }

    initDataSync() {
        try {
            const data = fs.readFileSync(this.filePath, { encoding: 'utf-8' });
            this.users = JSON.parse(data).map(parsedData => this.userMapper.map(parsedData));
            console.info('[MockUserRepository] Users loaded from file');
        } catch (err) {
            console.error('[MockUserRepository] Error loading users from file', err);
            this.users = [];
        }
    }

    getNextId() {
        return this.users.length > 0 ? Math.max(...this.users.map(user => user.id)) + 1 : 1;
    }

    async saveData() {
        const data = JSON.stringify(this.users, null, 2);
        await fs.writeFile(this.filePath, data, (err) => {
            if (err) throw err;
            console.info('[MockUserRepository] Users saved to file');
        });
    }

    async findOneById(id) {
        return this.users.find(user => user.id === parseInt(id));
    }

    async findOneByUsername(username) {
        return this.users.find(user => user.username === username);
    }

    async createUser(data) {
        const newUser = this.userMapper.map({
            ...data,
            id: this.nextId++,
            balance: data.balance || 0,
        });
        this.users.push(newUser);
        this.nextId++;
        await this.saveData();
        return newUser;
    }

    async updateUserFunds(id, balance) {
        const index = this.users.findIndex(user => user.id === parseInt(id));
        if (index === -1)
            throw new Error('User not found');

        const updatedUser = this.userMapper.map({
            ...this.users[index],
            balance: balance,
        });

        this.users[index] = updatedUser;
        await this.saveData();
        return updatedUser;
    }

    async changeUserFundsByDelta(id, delta) {
        const user = await this.findOneById(id);
        if (!user)
            throw new Error('User not found');
        return this.updateUserFunds(parseInt(id), user.balance + parseFloat(delta));
    }

}

module.exports = MockUserRepository;