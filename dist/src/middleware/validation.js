"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCommentUpdate = exports.validateCommentCreate = exports.validatePostUpdate = exports.validatePostCreate = void 0;
const express_validator_1 = require("express-validator");
exports.validatePostCreate = [
    (0, express_validator_1.body)('title').isString().notEmpty().withMessage('title is required'),
    (0, express_validator_1.body)('body').isString().notEmpty().withMessage('body is required'),
    (0, express_validator_1.body)('senderId').isString().notEmpty().withMessage('senderId is required'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    },
];
exports.validatePostUpdate = [
    // For full-replace semantics require all post fields on PUT
    (0, express_validator_1.body)('title').isString().notEmpty().withMessage('title is required'),
    (0, express_validator_1.body)('body').isString().notEmpty().withMessage('body is required'),
    (0, express_validator_1.body)('senderId').isString().notEmpty().withMessage('senderId is required'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    },
];
exports.validateCommentCreate = [
    (0, express_validator_1.body)('postId').isString().notEmpty().withMessage('postId is required'),
    (0, express_validator_1.body)('authorId').isString().notEmpty().withMessage('authorId is required'),
    (0, express_validator_1.body)('text').isString().notEmpty().withMessage('text is required'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    },
];
exports.validateCommentUpdate = [
    (0, express_validator_1.body)('text').isString().notEmpty().withMessage('text is required'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    },
];
//# sourceMappingURL=validation.js.map