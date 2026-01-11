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
    await request(app).post('/auth/register').send({ username: 'v1', email: 'v1@example.com', password: 'password' });
    const login = await request(app).post('/auth/login').send({ identifier: 'v1@example.com', password: 'password' });
    const token = login.body.accessToken;

    const res = await request(app).post('/post').send({ title: 'Only title' }).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('PUT /post returns 400 when title/body are empty', async () => {
    await request(app).post('/auth/register').send({ username: 'v2', email: 'v2@example.com', password: 'password' });
    const login = await request(app).post('/auth/login').send({ identifier: 'v2@example.com', password: 'password' });
    const token = login.body.accessToken;

    const created = await request(app).post('/post').send({ title: 'T', body: 'B' }).set('Authorization', `Bearer ${token}`);
    const id = created.body._id;
    const res = await request(app).put(`/post/${id}`).set('Authorization', `Bearer ${token}`).send({ title: '', body: '' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('POST /comment returns 400 when required fields missing', async () => {
    await request(app).post('/auth/register').send({ username: 'v3', email: 'v3@example.com', password: 'password' });
    const login = await request(app).post('/auth/login').send({ identifier: 'v3@example.com', password: 'password' });
    const token = login.body.accessToken;

    const post = await request(app).post('/post').send({ title: 'T', body: 'B' }).set('Authorization', `Bearer ${token}`);
    const postId = post.body._id;
    const res = await request(app).post('/comment').send({ postId }).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });

  it('PUT /comment returns 400 when text missing', async () => {
    await request(app).post('/auth/register').send({ username: 'v4', email: 'v4@example.com', password: 'password' });
    const login = await request(app).post('/auth/login').send({ identifier: 'v4@example.com', password: 'password' });
    const token = login.body.accessToken;

    const post = await request(app).post('/post').send({ title: 'T', body: 'B' }).set('Authorization', `Bearer ${token}`);
    const postId = post.body._id;
    const created = await request(app).post('/comment').send({ postId, text: 'x' }).set('Authorization', `Bearer ${token}`);
    const id = created.body._id;
    const res = await request(app).put(`/comment/${id}`).set('Authorization', `Bearer ${token}`).send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });
});
