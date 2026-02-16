require('dotenv').config();
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

const config = require('../config/MTlookup.json');

test.describe('GET /v1/topup/mobile/lookup/{mobile}', () => {

  test('VALID mobile (from config)', async ({ request }) => {

    const mobile = config.mobile;

    if (!mobile) {
      throw new Error('mobile is missing in config/MTlookup.json');
    }

    console.log('Using mobile:', mobile);

    const response = await request.get(
      `${BASE_URL}/v1/topup/mobile/lookup/${mobile}`,  // ✅ Correct endpoint
      {
        headers: {
          accept: '*/*',
          Authorization: `Bearer ${TOKEN}`,
        }
      }
    );

    const status = response.status();
    const resBody = await response.json();

    console.log('Status:', status);
    console.log('Response:', JSON.stringify(resBody, null, 2));

    // Assertions
    expect(status).toBe(200);
    expect(resBody).toBeDefined();
    expect(typeof resBody).toBe('object');

    if (resBody.brands) {
      expect(Array.isArray(resBody.brands)).toBe(true);
    }

    if (resBody.categories) {
      expect(Array.isArray(resBody.categories)).toBe(true);
    }
  });

});
