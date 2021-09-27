/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const supertest = require('supertest');
const request = require('supertest');
const app = require('./server');

let jwt = '';

// BEFOREALL CONNECT TO MONGODB
// AFTERALL CLOSE MONGODB CONNECTION

test('adds 1 to equal 1', () => {
  expect(1).toBe(1);
});

describe('ROUTE: /login', () => {
  test('Should get JWT from login route with proper credentials', async () => {
    const response = await request(app).post('/login').send({
      email: 'test@example.com',
      password: 'password',
    });
    if (typeof response.text === 'string') {
      jwt = response.text;
    }
    expect(response.statusCode).toBe(200);
  });

  test('Should not get JWT from login route with improper email', async () => {
    const response = await request(app).post('/login').send({
      email: 'tesst@example.com',
      password: 'password',
    });

    expect(response.statusCode).toBe(401);
  });

  test('Should not get JWT from /login endpoint with improper password', async () => {
    const response = await request(app).post('/login').send({
      email: 'test@example.com',
      password: 'passwords',
    });

    expect(response.statusCode).toBe(401);
  });
});

describe('ROUTE: /upload', () => {
  test('Should upload a CSV using the /upload endpoint with proper JWT', async () => {
    const response = await request(app)
      .post('/upload')
      .set('Authorization', `Bearer ${jwt}`)
      .attach('csv', './sample.csv');

    expect(response.statusCode).toBe(200);
  });
  test('Should not upload a CSV using the /upload endpoint without proper JWT', async () => {
    const response = await request(app)
      .post('/upload')
      .attach('csv', './sample.csv');

    expect(response.statusCode).toBe(401);
  });
});

describe('ROUTE: /identites', () => {
  test('Should retrieve users from the /identites endpoint with correct JWT', async () => {
    const response = await request(app)
      .get('/identites')
      .set('Authorization', `Bearer ${jwt}`);

    expect(typeof response.body).toBe('object');
    expect(response.body.length > 0).toBe(true);
    expect(response.statusCode).toBe(200);
  });

  test('Should not retrieve users from the /identites route with no JWT', async () => {
    const response = await request(app)
      .get('/identites');

    expect(response.statusCode).toBe(401);
  });
});
