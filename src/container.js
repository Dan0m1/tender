const awilix = require('awilix');
const UserService = require('./api/services/userService');
const TenderService = require('./api/services/tenderService');
const OfferService = require('./api/services/offerService');
const UserRepository = require('./api/repositories/userRepository');
const TenderRepository = require('./api/repositories/tenderRepository');
const OfferRepository = require('./api/repositories/offerRepository');
const UserController = require('./api/controllers/userController');
const TenderController = require('./api/controllers/tenderController');
const OfferController = require('./api/controllers/offerController');
const TenderMapper = require('./api/mappers/tenderMapper');
const OfferMapper = require('./api/mappers/offerMapper');
const UserMapper = require('./api/mappers/userMapper');
const MockUserRepository = require('./db/mock/repositories/mockUserRepository');
const MockTenderRepository = require("./db/mock/repositories/mockTenderRepository");
const sql = require('./db/sql');
const MockOfferRepository = require("./db/mock/repositories/mockOfferRepository");


const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
    strict: true,
});

const isMockDB = process.env.MOCK_DB === 'true';

container.register({
    tenderMapper: awilix.asClass(TenderMapper).singleton(),
    offerMapper: awilix.asClass(OfferMapper).singleton(),
    userMapper: awilix.asClass(UserMapper).singleton(),
})

container.register({
    userService: awilix.asClass(UserService),
    tenderService: awilix.asClass(TenderService),
    offerService: awilix.asClass(OfferService),

    userRepository: (!isMockDB)
        ? awilix.asClass(UserRepository).singleton()
        : awilix.asClass(MockUserRepository).singleton(),
    tenderRepository: (!isMockDB)
        ? awilix.asClass(TenderRepository).singleton()
        : awilix.asClass(MockTenderRepository).singleton(),
    offerRepository: (!isMockDB)
        ? awilix.asClass(OfferRepository).singleton()
        : awilix.asClass(MockOfferRepository).singleton(),

    userController: awilix.asClass(UserController),
    tenderController: awilix.asClass(TenderController),
    offerController: awilix.asClass(OfferController),

    sql: awilix.asValue(sql)
})

module.exports = container;