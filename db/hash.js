const bcrypt = require('bcrypt');

function hashPassword(password) {
    return  bcrypt.hashSync(password, 12);
}

function comparePasswords(plainTextPassword, hashPassword) {
    return bcrypt.compare(plainTextPassword, hashPassword);
}

module.exports = {hashPassword, comparePasswords}