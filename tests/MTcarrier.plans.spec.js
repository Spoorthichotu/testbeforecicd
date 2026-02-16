require('dotenv').config();
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

const config = require('../config/MTcarrierplan.json');

test.describe('GET /v1/topup/carrier/plans', () => {

  test('VALID query params from config', async ({ request }) => {

    const { operatorName, carrierName, countryCode } = config;

    // Validate config entries
    if (!operatorName || !carrierName || !countryCode) {
      throw new Error('Missing required fields in MTcarrierPlans.json');
    }

    console.log('Using:', { operatorName, carrierName, countryCode });

    const response = await request.get(
      `${BASE_URL}/v1/topup/carrier/plans`,
      {
        headers: {
          accept: '*/*',
          Authorization: `Bearer ${TOKEN}`
        },
        params: {
          operatorName,
          carrierName,
          countryCode
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

    // Optional validation if response is an array
    if (Array.isArray(resBody)) {
      expect(resBody.length).toBeGreaterThan(0);
    }
  });

});
