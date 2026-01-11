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
    // register user and obtain access token
    await request(app).post('/auth/register').send({ username: 'puser', email: 'puser@example.com', password: 'password' });
    const login = await request(app).post('/auth/login').send({ identifier: 'puser@example.com', password: 'password' });
    const token = login.body.accessToken;

    const res = await request(app).post('/post').send({ title: 'T1', body: 'B1' }).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe('T1');
  });

  it('lists posts and can filter by sender', async () => {
    // create two users and create posts as them
    await request(app).post('/auth/register').send({ username: 's1', email: 's1@example.com', password: 'password' });
    await request(app).post('/auth/register').send({ username: 's2', email: 's2@example.com', password: 'password' });
    const login1 = await request(app).post('/auth/login').send({ identifier: 's1@example.com', password: 'password' });
    const login2 = await request(app).post('/auth/login').send({ identifier: 's2@example.com', password: 'password' });
    await request(app).post('/post').send({ title: 'A', body: 'a' }).set('Authorization', `Bearer ${login1.body.accessToken}`);
    await request(app).post('/post').send({ title: 'B', body: 'b' }).set('Authorization', `Bearer ${login2.body.accessToken}`);

    const all = await request(app).get('/post');
    expect(all.status).toBe(200);
    expect(Array.isArray(all.body)).toBe(true);
    expect(all.body.length).toBe(2);

    const filtered = await request(app).get('/post').query({ sender: login1.body.user?.id ?? login1.body.user?._id ?? login1.body.user?.username ?? 's1' });
    expect(filtered.status).toBe(200);
    expect(filtered.body.length).toBe(1);
  });

  it('gets a post by id and returns 404 for missing', async () => {
    // create user and post
    await request(app).post('/auth/register').send({ username: 'g1', email: 'g1@example.com', password: 'password' });
    const login = await request(app).post('/auth/login').send({ identifier: 'g1@example.com', password: 'password' });
    const create = await request(app).post('/post').send({ title: 'T', body: 'B' }).set('Authorization', `Bearer ${login.body.accessToken}`);
    const id = create.body._id;

    const get = await request(app).get(`/post/${id}`);
    expect(get.status).toBe(200);
    expect(get.body._id).toBe(id);

    const notFound = await request(app).get('/post/000000000000000000000000');
    expect(notFound.status).toBe(404);
  });

  it('updates a post', async () => {
    // create user and post
    await request(app).post('/auth/register').send({ username: 'u_upd', email: 'u_upd@example.com', password: 'password' });
    const login = await request(app).post('/auth/login').send({ identifier: 'u_upd@example.com', password: 'password' });
    const create = await request(app).post('/post').send({ title: 'Old', body: 'Old' }).set('Authorization', `Bearer ${login.body.accessToken}`);
    const id = create.body._id;

    const updated = await request(app).put(`/post/${id}`).set('Authorization', `Bearer ${login.body.accessToken}`).send({ title: 'New', body: 'New' });
    expect(updated.status).toBe(200);
    expect(updated.body.title).toBe('New');
  });
});
