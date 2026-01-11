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

describe('Comments API', () => {
  it('creates and retrieves comments for a post', async () => {
    // create user and post
    await request(app).post('/auth/register').send({ username: 'cuser', email: 'cuser@example.com', password: 'password' });
    const login = await request(app).post('/auth/login').send({ identifier: 'cuser@example.com', password: 'password' });
    const post = await request(app).post('/post').send({ title: 'P', body: 'B' }).set('Authorization', `Bearer ${login.body.accessToken}`);
    const postId = post.body._id;

    const c = await request(app).post('/comment').send({ postId, text: 'hello' }).set('Authorization', `Bearer ${login.body.accessToken}`);
    expect(c.status).toBe(201);
    expect(c.body).toHaveProperty('_id');

    const list = await request(app).get('/comment').query({ post: postId });
    expect(list.status).toBe(200);
    expect(list.body.length).toBe(1);
  });

  it('updates and deletes a comment', async () => {
    await request(app).post('/auth/register').send({ username: 'c2', email: 'c2@example.com', password: 'password' });
    const login = await request(app).post('/auth/login').send({ identifier: 'c2@example.com', password: 'password' });
    const post = await request(app).post('/post').send({ title: 'P', body: 'B' }).set('Authorization', `Bearer ${login.body.accessToken}`);
    const postId = post.body._id;

    const created = await request(app).post('/comment').send({ postId, text: 'x' }).set('Authorization', `Bearer ${login.body.accessToken}`);
    const id = created.body._id;

    const upd = await request(app).put(`/comment/${id}`).send({ text: 'y' }).set('Authorization', `Bearer ${login.body.accessToken}`);
    expect(upd.status).toBe(200);
    expect(upd.body.text).toBe('y');

    const del = await request(app).delete(`/comment/${id}`).set('Authorization', `Bearer ${login.body.accessToken}`);
    expect(del.status).toBe(204);
  });
});
