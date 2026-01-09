/// <reference types="jest" />
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

const app = require('../index');
const { connectDB, disconnectDB } = require('../src/db');

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await connectDB(uri);
});

afterAll(async () => {
  await disconnectDB();
  if (mongod) await mongod.stop();
});

afterEach(async () => {
  // clear database between tests
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    if (collections[key]) await collections[key].deleteMany({});
  }
});

describe('Posts API', () => {
  it('creates a post and returns it', async () => {
    const res = await request(app)
      .post('/post')
      .send({ title: 'T1', body: 'B1', senderId: 'u1' })
      .set('Accept', 'application/json');

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe('T1');
  });

  it('lists posts and can filter by sender', async () => {
    await request(app).post('/post').send({ title: 'A', body: 'a', senderId: 's1' });
    await request(app).post('/post').send({ title: 'B', body: 'b', senderId: 's2' });

    const all = await request(app).get('/post');
    expect(all.status).toBe(200);
    expect(Array.isArray(all.body)).toBe(true);
    expect(all.body.length).toBe(2);

    const filtered = await request(app).get('/post').query({ sender: 's1' });
    expect(filtered.status).toBe(200);
    expect(filtered.body.length).toBe(1);
  });

  it('gets a post by id and returns 404 for missing', async () => {
    const create = await request(app).post('/post').send({ title: 'T', body: 'B', senderId: 's' });
    const id = create.body._id;

    const get = await request(app).get(`/post/${id}`);
    expect(get.status).toBe(200);
    expect(get.body._id).toBe(id);

    const notFound = await request(app).get('/post/000000000000000000000000');
    expect(notFound.status).toBe(404);
  });

  it('updates a post', async () => {
    const create = await request(app).post('/post').send({ title: 'Old', body: 'Old', senderId: 's' });
    const id = create.body._id;

    const updated = await request(app).put(`/post/${id}`).send({ title: 'New', body: 'New' });
    expect(updated.status).toBe(200);
    expect(updated.body.title).toBe('New');
  });
});
