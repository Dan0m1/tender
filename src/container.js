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