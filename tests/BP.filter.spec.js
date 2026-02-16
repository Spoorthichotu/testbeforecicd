require('dotenv').config();
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

const config = require('../config/billpaymentFilters.json');

test.describe('GET /v1/payout/billpayment/filters', () => {

  test('VALID country (from config)', async ({ request }) => {

    const country = config.country;

    if (!country) {
      throw new Error('Country is missing in config/billpaymentFilters.json');
    }

    console.log('Using country:', country);

    const response = await request.get(
      `${BASE_URL}/v1/payout/billpayment/filters?country=${country}`,
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
