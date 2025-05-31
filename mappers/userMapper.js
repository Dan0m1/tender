const User = require('../models/userModel');

class UserMapper {
    async map(user) {
        if(!user) return null;
        return new User(
            user.id,
            user.username,
            user.password,
            user.balance,
        )
    }
}

module.exports = UserMapper;