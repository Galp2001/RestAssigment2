"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    senderId: { type: String, required: true },
    likes: { type: Number, default: 0 },
}, { timestamps: true });
postSchema.index({ senderId: 1 });
exports.Post = (0, mongoose_1.model)('Post', postSchema);
//# sourceMappingURL=Post.js.map