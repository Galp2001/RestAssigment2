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
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    if (collections[key]) await collections[key].deleteMany({});
  }
});

describe('Validation errors', () => {
  it('POST /post returns 400 when required fields missing', async () => {
    const res = await request(app).post('/post').send({ title: 'Only title' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('PUT /post returns 400 when title/body are empty', async () => {
    const created = await request(app).post('/post').send({ title: 'T', body: 'B', senderId: 's' });
    const id = created.body._id;
    const res = await request(app).put(`/post/${id}`).send({ title: '', body: '' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('POST /comment returns 400 when required fields missing', async () => {
    const post = await request(app).post('/post').send({ title: 'T', body: 'B', senderId: 's' });
    const postId = post.body._id;
    const res = await request(app).post('/comment').send({ postId });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('PUT /comment returns 400 when text missing', async () => {
    const post = await request(app).post('/post').send({ title: 'T', body: 'B', senderId: 's' });
    const postId = post.body._id;
    const created = await request(app).post('/comment').send({ postId, authorId: 'a', text: 'x' });
    const id = created.body._id;
    const res = await request(app).put(`/comment/${id}`).send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });
});
