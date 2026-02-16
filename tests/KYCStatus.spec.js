require('dotenv').config();
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

// Load email from JSON
const kycData = require('../config/KYC.json');

test.describe('GET /v1/partners/kyc/status', () => {

  test('KYC Status Test', async ({ request }) => {

    const userEmail = kycData.userEmail;

    if (!userEmail) {
      throw new Error("❌ userEmail missing in config/KYC.json");
    }

    console.log('Checking KYC status for:', userEmail);

    const response = await request.get(
      `${BASE_URL}/v1/partners/kyc/status?userEmail=${userEmail}`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    const status = response.status();
    const body = await response.json();

    console.log("\n===== KYC STATUS RESPONSE =====");
    console.log(JSON.stringify(body, null, 2));

    expect(status).toBe(200);
    expect(body).toBeTruthy();
  });

});
