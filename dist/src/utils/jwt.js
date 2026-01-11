"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jwt = require('jsonwebtoken');
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';
const ACCESS_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';
function signAccessToken(payload) {
    const tokenPayload = { sub: payload.id, username: payload.username };
    return jwt.sign(tokenPayload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });
}
function signRefreshToken(payload) {
    const tokenPayload = { sub: payload.id };
    return jwt.sign(tokenPayload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
}
function verifyAccessToken(token) {
    return jwt.verify(token, ACCESS_SECRET);
}
function verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_SECRET);
}
//# sourceMappingURL=jwt.js.map