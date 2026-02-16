require('dotenv').config();
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

// Load email from JSON
const kycData = require('../config/KYC.json');

test.describe('GET /v1/partners/kyc/{userEmail}/review', () => {

  test('KYC Review Test', async ({ request }) => {

    const userEmail = kycData.userEmail;

    if (!userEmail) {
      throw new Error("userEmail is missing in config/KYC.json");
    }

    console.log('Checking KYC review for:', userEmail);

    const response = await request.get(
      `${BASE_URL}/v1/partners/kyc/${userEmail}/review`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    const status = response.status();
    const body = await response.json();

    console.log("\n===== KYC REVIEW RESPONSE =====");
    console.log(JSON.stringify(body, null, 2));

    // EXPECT 200 OR 201 depending on API behavior
    expect([200, 201]).toContain(status);

    expect(body).toBeTruthy();
  });

});
