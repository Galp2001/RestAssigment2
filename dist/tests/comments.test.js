"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="jest" />
const supertest_1 = __importDefault(require("supertest"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const app = require('../index');
const { connectDB, disconnectDB } = require('../src/db');
let mongod;
beforeAll(async () => {
    mongod = await mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongod.getUri();
    await connectDB(uri);
});
afterAll(async () => {
    await disconnectDB();
    if (mongod)
        await mongod.stop();
});
afterEach(async () => {
    const collections = mongoose_1.default.connection.collections;
    for (const key in collections) {
        if (collections[key])
            await collections[key].deleteMany({});
    }
});
describe('Comments API', () => {
    it('creates and retrieves comments for a post', async () => {
        const post = await (0, supertest_1.default)(app).post('/post').send({ title: 'P', body: 'B', senderId: 's' });
        const postId = post.body._id;
        const c = await (0, supertest_1.default)(app).post('/comment').send({ postId, authorId: 'a1', text: 'hello' });
        expect(c.status).toBe(201);
        expect(c.body).toHaveProperty('_id');
        const list = await (0, supertest_1.default)(app).get('/comment').query({ post: postId });
        expect(list.status).toBe(200);
        expect(list.body.length).toBe(1);
    });
    it('updates and deletes a comment', async () => {
        const post = await (0, supertest_1.default)(app).post('/post').send({ title: 'P', body: 'B', senderId: 's' });
        const postId = post.body._id;
        const created = await (0, supertest_1.default)(app).post('/comment').send({ postId, authorId: 'a2', text: 'x' });
        const id = created.body._id;
        const upd = await (0, supertest_1.default)(app).put(`/comment/${id}`).send({ text: 'y' });
        expect(upd.status).toBe(200);
        expect(upd.body.text).toBe('y');
        const del = await (0, supertest_1.default)(app).delete(`/comment/${id}`);
        expect(del.status).toBe(204);
    });
});
//# sourceMappingURL=comments.test.js.map