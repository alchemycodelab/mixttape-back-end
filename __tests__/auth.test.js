require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  // beforeEach(() => {
  //   User.create({ username: 'treemoney', password: '1234' });
  // });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('should be able to sign up a user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ username: 'treemo', password: '1234' })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'treemo',
          __v: 0
        });
      });
  });

  it('can login a user with username and password', async() => {
    const user = await User.create({
      username: 'treemo',
      password: 'password'
    });

    return request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'treemo', password: 'password' })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
        expect(res.body).toEqual({
          _id: user.id,
          username: 'treemo',
          __v: 0
        });
      });
  });
});
