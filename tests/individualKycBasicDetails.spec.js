require('dotenv').config();
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

// Load request body from JSON file
const basicDetailsPayload = require('../config/individualBasicDetails.json');

test.describe('Partner KYC → Individual Basic Details', () => {

  test('Submit individual basic KYC details', async ({ request }) => {

    // ---------- STEP 1: PRINT PAYLOAD ----------
    console.log('Submitting KYC Basic Details Payload:');
    console.log(JSON.stringify(basicDetailsPayload, null, 2));

    // ---------- STEP 2: POST REQUEST ----------
    const response = await request.post(
      `${BASE_URL}/v1/partners/kyc/individual/basic-details`,
      {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`
        },
        data: basicDetailsPayload
      }
    );

    const status = response.status();
    const responseBody = await response.json();

    console.log('Status:', status);
    console.log('Response:', JSON.stringify(responseBody, null, 2));

    // ---------- STEP 3: ASSERTIONS ----------
    expect([200, 201]).toContain(status);
    expect(responseBody).toBeDefined();

    // Optional safety checks depending on API structure
    if (responseBody.requestId) {
      expect(responseBody.requestId).toBeTruthy();
    }

    if (responseBody.status) {
      expect(responseBody.status).toBeTruthy();
    }

  });

});
