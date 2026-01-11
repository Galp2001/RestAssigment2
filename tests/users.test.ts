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

describe('Users & Auth', () => {
  it('registers a user and returns access token + refresh cookie', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'u1', email: 'u1@example.com', password: 'password' })
      .set('Accept', 'application/json');

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('accessToken');
    const cookies = res.headers['set-cookie'];
    expect(cookies && cookies.some((c: string) => c.startsWith('refreshToken='))).toBe(true);
  });

  it('prevents duplicate registration', async () => {
    await request(app).post('/auth/register').send({ username: 'u2', email: 'u2@example.com', password: 'password' });
    const res = await request(app).post('/auth/register').send({ username: 'u2', email: 'u2@example.com', password: 'password' });
    expect(res.status).toBe(409);
  });

  it('logs in and can access protected route with access token', async () => {
    await request(app).post('/auth/register').send({ username: 'u3', email: 'u3@example.com', password: 'password' });
    const login = await request(app).post('/auth/login').send({ identifier: 'u3@example.com', password: 'password' });
    expect(login.status).toBe(200);
    expect(login.body).toHaveProperty('accessToken');
    const access = login.body.accessToken;

    // create user id and fetch it via /users/:id
    const usersList = await request(app).get('/users');
    const id = usersList.body.find((u: any) => u.username === 'u3')._id;

    const unauth = await request(app).get(`/users/${id}`);
    expect(unauth.status).toBe(200); // public profile is allowed

    const protectedReq = await request(app).get(`/users/${id}`).set('Authorization', `Bearer ${access}`);
    expect(protectedReq.status).toBe(200);
  });

  it('refreshes access token using refresh cookie', async () => {
    await request(app).post('/auth/register').send({ username: 'u4', email: 'u4@example.com', password: 'password' });
    const login = await request(app).post('/auth/login').send({ identifier: 'u4@example.com', password: 'password' });
    const cookies = login.headers['set-cookie'];
    expect(cookies).toBeDefined();
    const res = await request(app).post('/auth/refresh').set('Cookie', cookies as string[]);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('logout revokes refresh token', async () => {
    await request(app).post('/auth/register').send({ username: 'u5', email: 'u5@example.com', password: 'password' });
    const login = await request(app).post('/auth/login').send({ identifier: 'u5@example.com', password: 'password' });
    const cookies = login.headers['set-cookie'];
    const res = await request(app).post('/auth/logout').set('Cookie', cookies as string[]);
    expect(res.status).toBe(204);
  });
});
