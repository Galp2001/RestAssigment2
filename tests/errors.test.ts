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

describe('Error handling and mapping', () => {
  it('returns structured conflict for duplicate user registration', async () => {
    await request(app).post('/auth/register').send({ username: 'dupe', email: 'dupe@example.com', password: 'password' });
    const res = await request(app).post('/auth/register').send({ username: 'dupe', email: 'dupe@example.com', password: 'password' });
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty('message');
  });

  it('maps validation failures to structured error', async () => {
    await request(app).post('/auth/register').send({ username: 'vuser', email: 'vuser@example.com', password: 'password' });
    const login = await request(app).post('/auth/login').send({ identifier: 'vuser@example.com', password: 'password' });
    const token = login.body.accessToken;
    const res = await request(app).post('/post').send({ title: 'Only title' }).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(Array.isArray(res.body.error.details)).toBe(true);
  });

  it('maps invalid ids (CastError) to 400', async () => {
    const res = await request(app).get('/users/invalid-id-format');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error.message.toLowerCase()).toMatch(/invalid/);
  });
});
