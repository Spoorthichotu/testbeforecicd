require('dotenv').config();
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

const config = require('../config/BPoperator.json');

test.describe('GET /v1/payout/billpayment/operator', () => {

  test('VALID countryCode + category (from config)', async ({ request }) => {

    const countryCode = config.countryCode;
    const category = config.category;  // <-- Added category

    if (!countryCode) {
      throw new Error('countryCode is missing in config/BPoperator.json');
    }

    if (!category) {
      throw new Error('category is missing in config/BPoperator.json');
    }

    console.log('Using countryCode:', countryCode);
    console.log('Using category:', category);

    const response = await request.get(
      `${BASE_URL}/v1/payout/billpayment/operator?countryCode=${countryCode}&category=${category}`, // <-- Added category
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

    // Basic assertions
    expect(status).toBe(200);
    expect(resBody).toBeDefined();
    expect(Object.keys(resBody).length).toBeGreaterThan(0);

    // Response structure validations
    if (resBody.brands) {
      expect(Array.isArray(resBody.brands)).toBe(true);
    }

    if (resBody.categories) {
      expect(Array.isArray(resBody.categories)).toBe(true);
    }

    // EXPECTED operator list when category is included
    if (resBody.operators) {
      expect(Array.isArray(resBody.operators)).toBe(true);
    }
  });

});
