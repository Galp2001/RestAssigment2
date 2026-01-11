"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const postController_1 = require("../controllers/postController");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
exports.postsRouter = router;
router.post('/', validation_1.validatePostCreate, postController_1.createPost);
router.get('/', postController_1.listPosts);
router.get('/:id', postController_1.getPost);
router.put('/:id', validation_1.validatePostUpdate, postController_1.updatePost);
//# sourceMappingURL=posts.js.map