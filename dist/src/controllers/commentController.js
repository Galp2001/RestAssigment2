"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComment = createComment;
exports.listComments = listComments;
exports.getComment = getComment;
exports.updateComment = updateComment;
exports.deleteComment = deleteComment;
const models_1 = require("../models");
async function createComment(req, res, next) {
    try {
        const { postId, authorId, text } = req.body;
        const created = await models_1.Comment.create({ postId, authorId, text });
        return res.status(201).json(created);
    }
    catch (err) {
        return next(err);
    }
}
async function listComments(req, res, next) {
    try {
        const post = req.query.post;
        const filter = post ? { postId: post } : {};
        const comments = await models_1.Comment.find(filter).sort({ createdAt: -1 });
        return res.json(comments);
    }
    catch (err) {
        return next(err);
    }
}
async function getComment(req, res, next) {
    try {
        const comment = await models_1.Comment.findById(req.params.id);
        if (!comment)
            return res.status(404).json({ error: 'Comment not found' });
        return res.json(comment);
    }
    catch (err) {
        return next(err);
    }
}
async function updateComment(req, res, next) {
    try {
        const { text } = req.body;
        const updated = await models_1.Comment.findByIdAndUpdate(req.params.id, { text }, { new: true, runValidators: true });
        if (!updated)
            return res.status(404).json({ error: 'Comment not found' });
        return res.json(updated);
    }
    catch (err) {
        return next(err);
    }
}
async function deleteComment(req, res, next) {
    try {
        const deleted = await models_1.Comment.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ error: 'Comment not found' });
        return res.status(204).send();
    }
    catch (err) {
        return next(err);
    }
}
//# sourceMappingURL=commentController.js.map