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
    // clear database between tests
    const collections = mongoose_1.default.connection.collections;
    for (const key in collections) {
        if (collections[key])
            await collections[key].deleteMany({});
    }
});
describe('Posts API', () => {
    it('creates a post and returns it', async () => {
        const res = await (0, supertest_1.default)(app)
            .post('/post')
            .send({ title: 'T1', body: 'B1', senderId: 'u1' })
            .set('Accept', 'application/json');
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.title).toBe('T1');
    });
    it('lists posts and can filter by sender', async () => {
        await (0, supertest_1.default)(app).post('/post').send({ title: 'A', body: 'a', senderId: 's1' });
        await (0, supertest_1.default)(app).post('/post').send({ title: 'B', body: 'b', senderId: 's2' });
        const all = await (0, supertest_1.default)(app).get('/post');
        expect(all.status).toBe(200);
        expect(Array.isArray(all.body)).toBe(true);
        expect(all.body.length).toBe(2);
        const filtered = await (0, supertest_1.default)(app).get('/post').query({ sender: 's1' });
        expect(filtered.status).toBe(200);
        expect(filtered.body.length).toBe(1);
    });
    it('gets a post by id and returns 404 for missing', async () => {
        const create = await (0, supertest_1.default)(app).post('/post').send({ title: 'T', body: 'B', senderId: 's' });
        const id = create.body._id;
        const get = await (0, supertest_1.default)(app).get(`/post/${id}`);
        expect(get.status).toBe(200);
        expect(get.body._id).toBe(id);
        const notFound = await (0, supertest_1.default)(app).get('/post/000000000000000000000000');
        expect(notFound.status).toBe(404);
    });
    it('updates a post', async () => {
        const create = await (0, supertest_1.default)(app).post('/post').send({ title: 'Old', body: 'Old', senderId: 's' });
        const id = create.body._id;
        const updated = await (0, supertest_1.default)(app).put(`/post/${id}`).send({ title: 'New', body: 'New', senderId: 's' });
        expect(updated.status).toBe(200);
        expect(updated.body.title).toBe('New');
    });
});
//# sourceMappingURL=posts.test.js.map