const awilix = require('awilix');
const UserService = require('./services/userService');
const TenderService = require('./services/tenderService');
const OfferService = require('./services/offerService');
const UserRepository = require('./repositories/userRepository');
const TenderRepository = require('./repositories/tenderRepository');
const OfferRepository = require('./repositories/offerRepository');
const UserController = require('./controllers/userController');
const TenderController = require('./controllers/tenderController');
const OfferController = require('./controllers/offerController');
const TenderMapper = require('./mappers/tenderMapper');
const OfferMapper = require('./mappers/offerMapper');
const UserMapper = require('./mappers/userMapper');
const sql = require('./db/sql');

const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
    strict: true,
});


container.register({
    userService: awilix.asClass(UserService),
    tenderService: awilix.asClass(TenderService),
    offerService: awilix.asClass(OfferService),

    userRepository: awilix.asClass(UserRepository),
    tenderRepository: awilix.asClass(TenderRepository),
    offerRepository: awilix.asClass(OfferRepository),

    userController: awilix.asClass(UserController),
    tenderController: awilix.asClass(TenderController),
    offerController: awilix.asClass(OfferController),

    tenderMapper: awilix.asClass(TenderMapper),
    offerMapper: awilix.asClass(OfferMapper),
    userMapper: awilix.asClass(UserMapper),

    sql: awilix.asValue(sql)
})

module.exports = container;