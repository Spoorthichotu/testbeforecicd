require('dotenv').config();
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

// Load Request Body from JSON
const businessData = require('../config/KYCbusiness.json');

test.describe('POST /v1/partners/kyc/business/basic-details', () => {

  test('Submit Business Basic Details', async ({ request }) => {

    console.log("Submitting Business Basic Details:");
    console.log(JSON.stringify(businessData, null, 2));

    const response = await request.post(
      `${BASE_URL}/v1/partners/kyc/business/basic-details`,
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`
        },
        data: businessData
      }
    );

    const status = response.status();
    const body = await response.json();

    console.log("\n===== BUSINESS BASIC DETAILS RESPONSE =====");
    console.log(JSON.stringify(body, null, 2));

    expect([200, 201]).toContain(status);
    expect(body).toBeTruthy();
  });

});
