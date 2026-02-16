require('dotenv').config();
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

const config = require('../config/BPcategory.json');

test.describe('GET /v1/payout/billpayment/category', () => {

  test('VALID countryCode (from config)', async ({ request }) => {

    const countryCode = config.countryCode;

    if (!countryCode) {
      throw new Error('countryCode is missing in config/BPcategory.json');
    }

    console.log('Using countryCode:', countryCode);

    const response = await request.get(
      `${BASE_URL}/v1/payout/billpayment/category?countryCode=${countryCode}`,
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

    // ✅ Correct assertions
    expect(status).toBe(200);
    expect(resBody).toBeDefined();

    // Optional but safe structure checks
    expect(Object.keys(resBody).length).toBeGreaterThan(0);

    // If these fields exist in response
    if (resBody.brands) {
      expect(Array.isArray(resBody.brands)).toBe(true);
    }

    if (resBody.categories) {
      expect(Array.isArray(resBody.categories)).toBe(true);
    }
  });

});
