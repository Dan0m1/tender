const User = require('../../db/models/userModel');

class UserMapper {
    async map(user) {
        if(!user) return null;
        return new User(
            parseInt(user.id),
            user.username,
            user.password,
            parseFloat(user.balance),
        )
    }
}

module.exports = UserMapper;