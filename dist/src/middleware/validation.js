"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserUpdate = exports.validateLogin = exports.validateRegister = exports.validateCommentUpdate = exports.validateCommentCreate = exports.validatePostUpdate = exports.validatePostCreate = void 0;
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
// User validation
exports.validateRegister = [
    (0, express_validator_1.body)('username').isString().trim().notEmpty().withMessage('username is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('valid email is required'),
    (0, express_validator_1.body)('password').isString().isLength({ min: 6 }).withMessage('password must be at least 6 chars'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    },
];
exports.validateLogin = [
    (0, express_validator_1.body)('identifier').isString().notEmpty().withMessage('email or username required'),
    (0, express_validator_1.body)('password').isString().notEmpty().withMessage('password required'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    },
];
exports.validateUserUpdate = [
    (0, express_validator_1.body)('displayName').optional().isString(),
    (0, express_validator_1.body)('bio').optional().isString(),
    (0, express_validator_1.body)('password').optional().isLength({ min: 6 }).withMessage('password must be at least 6 chars'),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    },
];
//# sourceMappingURL=validation.js.map