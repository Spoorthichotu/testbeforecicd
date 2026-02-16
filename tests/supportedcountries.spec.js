require('dotenv').config();
const { test, expect } = require('@playwright/test');

// If you want to use config.countryCode, import config.js
// const config = require('../config');  // <-- Uncomment if needed

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

test.describe('GET /v1/partners/supportedCountries', () => {

  test('Should return supported crypto list', async ({ request }) => {

    const response = await request.get(
      `${BASE_URL}/v1/partners/supportedCountries`,
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

    // Assertions
    expect(status).toBe(201);
    expect(resBody).toBeDefined();
    expect(typeof resBody).toBe('object');

    // Optional structure checks
    if (resBody.brands) {
      expect(Array.isArray(resBody.brands)).toBe(true);
    }

    if (resBody.categories) {
      expect(Array.isArray(resBody.categories)).toBe(true);
    }
  });

});
