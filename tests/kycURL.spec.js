require('dotenv').config();
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

// Load inputs from JSON
const kycUrlData = require('../config/kycUrl.json');

test.describe('GET /v1/partners/kycurl/v2', () => {

  test('Fetch KYC URL V2', async ({ request }) => {

    const { accountType, email } = kycUrlData;

    if (!accountType || !email) {
      throw new Error("accountType or email missing in config/kycUrl.json");
    }

    console.log("Using accountType:", accountType);
    console.log("Using email:", email);

    const response = await request.get(
      `${BASE_URL}/v1/partners/kycurl/v2`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TOKEN}`
        },
        params: {
          accountType,
          email
        }
      }
    );

    const status = response.status();
    const body = await response.json();

    console.log("\n===== KYC URL V2 RESPONSE =====");
    console.log(JSON.stringify(body, null, 2));

    expect([200, 201]).toContain(status);
    expect(body).toBeTruthy();
  });

});
