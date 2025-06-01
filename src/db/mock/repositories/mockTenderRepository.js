const fs = require('fs');
const path = require('path');

class MockTenderRepository {
    constructor({tenderMapper, userRepository}) {
        this.tenderMapper = tenderMapper;
        this.userRepository = userRepository;
        this.filePath = path.join(__dirname, '../data/tenders.json');
        this.tenders = []
        this.isLoaded = false;
        this.nextId = 1;

        this.loadDataSync();
        this.nextId = this.getNextId();

    }


    loadDataSync() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            this.tenders = JSON.parse(data).map(parsedData => this.tenderMapper.map(parsedData));
            this.isLoaded = true;
            console.log(`[MockTenderRepository] Tenders have been loaded from file.`);
        } catch (error) {
            console.error('[MockTenderRepository] Error occurred while trying to load tenders from file.', error);
            this.tenders = [];
            this.isLoaded = false;
        }
    }


    getNextId() {
        return this.tenders.length > 0 ? Math.max(...this.tenders.map(tender => tender.id)) + 1 : 1;
    }

    saveDataWithCallback(callback) {
        const data = JSON.stringify(this.tenders, null, 2);
        fs.writeFile(this.filePath, data, callback)
    }

    #ensureDataLoaded() {
        if (!this.isLoaded) {
            this.loadDataSync();
            if (!this.isLoaded)
                throw new Error("Tenders haven't been loaded yet. Try again later.");
        }
        return true;
    }

    async #ensureDataLoadedAndCallCallback(callback) {
        const maxRetries = 5;
        const retryDelay = 1000;
        let retries = 0;

        while (retries < maxRetries) {
            try {
                this.#ensureDataLoaded();
                return callback();
            } catch (error) {
                console.error(error);
                retries++;
                if (retries === maxRetries) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }
    }

    async getAllTenders() {
        return this.#ensureDataLoadedAndCallCallback(() => {
            return this.tenders;
        })
    }

    async findOneById(id) {
        return this.#ensureDataLoadedAndCallCallback(() => {
            return this.tenders.find(tender => tender.id === parseInt(id));
        })
    }

    async createTender(data) {
        const newTender = this.tenderMapper.map({
            ...data,
            id: this.nextId++,
            currentPrice: data.startingPrice,
            winnerId: null,
            isActive: true,
            isHidden: false,
        });
        return new Promise((resolve, reject) => {
            this.tenders.push(newTender);
            this.saveDataWithCallback(error => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(newTender);
                    }
                }
            )
        })
    }

    async createTenderAndTakeTax(data, userId, newBalance) {
        return Promise.all([
            this.userRepository.updateUserFunds(parseInt(userId), parseFloat(newBalance)),
            this.createTender(data),
        ]);
    }

    async update(id, tenderData) {
        return this.#ensureDataLoadedAndCallCallback(() => {
            const index = this.tenders.findIndex(tender => tender.id === parseInt(id));
            if (index === -1) throw new Error('User not found');

            const updatedTender = {...this.tenders[index], ...tenderData};
            this.tenders[index] = updatedTender;

            return new Promise((resolve, reject) => {
                this.saveDataWithCallback((error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(updatedTender);
                    }
                });
            });
        });
    }


    async updateTenderIsActive(tenderId, isActive) {
       return this.update(tenderId, {isActive});
    }

    async updateTenderIsHidden(tenderId, isHidden) {
        return this.update(tenderId, {isHidden});
    }

    async updateTenderWinner(tenderId, userId) {
        return this.update(tenderId, {winnerId: userId});
    }

    async updateTenderCurrentPrice(tenderId, currentPrice) {
        return this.update(tenderId, {currentPrice});
    }

    async deleteById(id) {
        return this.#ensureDataLoadedAndCallCallback(() => {
            const index = this.tenders.findIndex(tender => tender.id === parseInt(id));
            if (index === -1) throw new Error('User not found');

            this.tenders.splice(index, 1);
            this.saveDataWithCallback((error) => {
                if (error) {
                    throw error;
                }
            });
        })
    }
}

module.exports = MockTenderRepository;