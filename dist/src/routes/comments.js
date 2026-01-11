"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = require("express");
const commentController_1 = require("../controllers/commentController");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
exports.commentsRouter = router;
router.post('/', validation_1.validateCommentCreate, commentController_1.createComment);
router.get('/', commentController_1.listComments);
router.get('/:id', commentController_1.getComment);
router.put('/:id', validation_1.validateCommentUpdate, commentController_1.updateComment);
router.delete('/:id', commentController_1.deleteComment);
//# sourceMappingURL=comments.js.map