require('dotenv').config();
const { test, expect } = require('@playwright/test');

// Load env variables
const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

// Load inputs from JSON
const kycUrlData = require('../config/kycurl.json');

test.describe('GET /v1/partners/kycurl/v2', () => {

  test('Fetch KYC URL V2', async ({ request }) => {

    // Validate env
    if (!BASE_URL) {
      throw new Error('BASE_URL is missing. Check .env file.');
    }

    // Read from JSON
    const { accountType, email } = kycUrlData;

    // Validate JSON
    if (!accountType || !email) {
      throw new Error('accountType or email missing in kycUrl.json');
    }

    console.log('Using BASE_URL:', BASE_URL);
    console.log('Using accountType:', accountType);
    console.log('Using email:', email);

    // API call
    const response = await request.get(
      `${BASE_URL}/v1/partners/kycurl/v2`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TOKEN}`,
        },
        params: {
          accountType,
          email,
        },
      }
    );

    // Assertions
    const status = response.status();
    const body = await response.json();

    console.log('\n===== KYC URL V2 RESPONSE =====');
    console.log(JSON.stringify(body, null, 2));

    expect([200, 201]).toContain(status);
    expect(body).toBeTruthy();
  });

});
