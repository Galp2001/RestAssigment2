"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = createPost;
exports.listPosts = listPosts;
exports.getPost = getPost;
exports.updatePost = updatePost;
const models_1 = require("../models");
async function createPost(req, res, next) {
    try {
        const { title, body, senderId } = req.body;
        const created = await models_1.Post.create({ title, body, senderId });
        return res.status(201).json(created);
    }
    catch (err) {
        return next(err);
    }
}
async function listPosts(req, res, next) {
    try {
        const sender = req.query.sender;
        const filter = sender ? { senderId: sender } : {};
        const posts = await models_1.Post.find(filter).sort({ createdAt: -1 });
        return res.json(posts);
    }
    catch (err) {
        return next(err);
    }
}
async function getPost(req, res, next) {
    try {
        const post = await models_1.Post.findById(req.params.id);
        if (!post)
            return res.status(404).json({ error: 'Post not found' });
        return res.json(post);
    }
    catch (err) {
        return next(err);
    }
}
async function updatePost(req, res, next) {
    try {
        const { title, body, senderId } = req.body;
        // Full replace: overwrite the post fields with the provided values
        const updated = await models_1.Post.findByIdAndUpdate(req.params.id, { title, body, senderId }, { new: true, runValidators: true });
        if (!updated)
            return res.status(404).json({ error: 'Post not found' });
        return res.json(updated);
    }
    catch (err) {
        return next(err);
    }
}
//# sourceMappingURL=postController.js.map