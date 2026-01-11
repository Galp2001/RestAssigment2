"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    displayName: { type: String },
    bio: { type: String },
}, { timestamps: true });
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
exports.User = (0, mongoose_1.model)('User', userSchema);
//# sourceMappingURL=User.js.map