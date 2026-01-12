require('dotenv').config();
const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

const config = require('../config/userId.json');

test.describe('GET /v1/partners/user/:userId', () => {

  test('VALID userId (from config)', async ({ request }) => {

    const validUserId = config.validUserId || config.userId;

    if (!validUserId) {
      throw new Error('VALID userId is missing in config/userId.json');
    }

    console.log('Using VALID userId:', validUserId);

    const response = await request.get(
      `${BASE_URL}/v1/partners/user/${validUserId}`,
      {
        headers: {
          accept: '*/*',
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    const status = response.status();
    const resBody = await response.json();

    console.log('Status:', status);
    console.log('Response:', JSON.stringify(resBody, null, 2));

    expect(status).toBe(200);
    expect(resBody.success).toBe(true);
    expect(resBody.data.exists).toBe(true);
  });

  test('INVALID userId (faker)', async ({ request }) => {

    const invalidUserId = faker.string.hexadecimal({ length: 24 });

    console.log('Using INVALID userId:', invalidUserId);

    const response = await request.get(
      `${BASE_URL}/v1/partners/user/${invalidUserId}`,
      {
        headers: {
          accept: '*/*',
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    const status = response.status();
    const resBody = await response.json();

    console.log('Status:', status);
    console.log('Response:', JSON.stringify(resBody, null, 2));

    expect(status).toBe(404);
    expect(resBody.success).toBe(false);
    expect(resBody.code).toBe('EN-DATA-007');
    expect(resBody.data.exists).toBe(false);
  });

});
