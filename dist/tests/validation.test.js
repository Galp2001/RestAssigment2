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
describe('Validation errors', () => {
    it('POST /post returns 400 when required fields missing', async () => {
        const res = await (0, supertest_1.default)(app).post('/post').send({ title: 'Only title' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
    });
    it('PUT /post returns 400 when title/body are empty', async () => {
        const created = await (0, supertest_1.default)(app).post('/post').send({ title: 'T', body: 'B', senderId: 's' });
        const id = created.body._id;
        const res = await (0, supertest_1.default)(app).put(`/post/${id}`).send({ title: '', body: '' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
    });
    it('POST /comment returns 400 when required fields missing', async () => {
        const post = await (0, supertest_1.default)(app).post('/post').send({ title: 'T', body: 'B', senderId: 's' });
        const postId = post.body._id;
        const res = await (0, supertest_1.default)(app).post('/comment').send({ postId });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
    });
    it('PUT /comment returns 400 when text missing', async () => {
        const post = await (0, supertest_1.default)(app).post('/post').send({ title: 'T', body: 'B', senderId: 's' });
        const postId = post.body._id;
        const created = await (0, supertest_1.default)(app).post('/comment').send({ postId, authorId: 'a', text: 'x' });
        const id = created.body._id;
        const res = await (0, supertest_1.default)(app).put(`/comment/${id}`).send({});
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
    });
});
//# sourceMappingURL=validation.test.js.map