"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
async function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}
async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}
//# sourceMappingURL=password.js.map