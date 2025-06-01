const fs = require('fs').promises;
const path = require('path');
const Offer = require('../../models/offerModel');

class MockOfferRepository {
    constructor({ offerMapper }) {
        this.filePath = path.join(__dirname, '../data/offers.json');
        this.offerMapper = offerMapper;
        this.offers = [];
        this.nextId = 1;

        this.dataPromise = this.loadDataWithPromises()
            .then(() => {
                console.info('[MockOfferRepository] Offers loaded from file');
                return true;
            })
            .catch(error => {
                console.error('[MockOfferRepository] Error while trying to load offers from file.', error);
                return false;
            })
    }

    async loadDataWithPromises() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            const parsedData = JSON.parse(data);
            this.offers = parsedData.map(offerData => this.offerMapper.map({
                    ...offerData,
                    createdAt: new Date(offerData.createdAt),
                })
            )
            this.nextId = this.getNextId();
            return true;
        } catch (err) {
            console.error('[MockOfferRepository] Error while trying to load offers from file.', err);
            throw error;
        }
    }

    getNextId() {
        return this.offers.length > 0 ? Math.max(...this.offers.map(offer => offer.id)) + 1 : 1;
    }

    async saveDataWithPromises() {
        try {
            const data = JSON.stringify(this.offers, (key, value) => {
                if (value instanceof Date) {
                    return value.toISOString();
                }
                return value;
            }, 2);
            await fs.writeFile(this.filePath, data);
            return true;
        } catch (error) {
            console.error('[MockOfferRepository] Error while trying to save offers to file.', error);
            throw error;
        }
    }

    async ensureDataLoaded() {
        if (!this.dataPromise) {
            return true;
        }
        return this.dataPromise;
    }

    async createOffer(data) {
        await this.ensureDataLoaded();
        const newOffer = this.offerMapper.map({
            ...data,
            id: this.nextId++,
            isActive: true,
            createdAt: offerData.createdAt || new Date(),
        });
        this.offers.push(newOffer);
        await this.saveDataWithPromises();
        return newOffer;
    }

    async getAllActiveOfferByTenderId(tenderId) {
        await this.ensureDataLoaded();
        return this.offers.filter(offer => offer.tenderId === tenderId && offer.isActive);
    }

    async getHighestActiveOfferByTenderId(tenderId) {
        await this.ensureDataLoaded();
        return this.offers.filter(offer => offer.tenderId === tenderId && offer.isActive).sort((a, b) => b.amount - a.amount)[0];
    }

    async update(id, offerData) {
        await this.ensureDataLoaded();
        const index = this.offers.findIndex(offer => offer.id === parseInt(id));
        if (index === -1) throw new Error('Offer not found');

        const updatedOffer = { ...this.offers[index], ...offerData };
        this.offers[index] = updatedOffer;
        await this.saveDataWithPromises();
        return updatedOffer;
    }

    async updateOfferIsActive(offerId, isActive){
        await this.ensureDataLoaded();
        const index = this.offers.findIndex(offer => offer.id === parseInt(offerId));
        if (index === -1) throw new Error('Offer not found');
    }
}

module.exports = MockOfferRepository;