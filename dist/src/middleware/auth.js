"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const { verifyAccessToken } = require('../utils/jwt');
async function authMiddleware(req, res, next) {
    try {
        const auth = req.headers.authorization;
        if (!auth || !auth.startsWith('Bearer '))
            return res.status(401).json({ error: 'Unauthorized' });
        const token = auth.slice(7);
        const payload = verifyAccessToken(token);
        // attach minimal user info
        req.user = { id: payload.sub, username: payload.username };
        next();
    }
    catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}
//# sourceMappingURL=auth.js.map