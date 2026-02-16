require('dotenv').config();
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

// Load request body from JSON file
const documentPayload = require('../config/individualDocument.json');

test.describe('Partner KYC → Individual Document', () => {

  test('Submit individual document KYC details', async ({ request }) => {

    // ---------- STEP 1: PRINT PAYLOAD ----------
    console.log('Submitting KYC Document Payload:');
    console.log(JSON.stringify(documentPayload, null, 2));

    // ---------- STEP 2: POST REQUEST ----------
    const response = await request.post(
      `${BASE_URL}/v1/partners/kyc/individual/document`,
      {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`
        },
        data: documentPayload
      }
    );

    const status = response.status();
    const responseBody = await response.json();

    console.log('Status:', status);
    console.log('Response:', JSON.stringify(responseBody, null, 2));

    // ---------- STEP 3: ASSERTIONS ----------
    expect([200, 201]).toContain(status);
    expect(responseBody).toBeDefined();

    if (responseBody.requestId) {
      expect(responseBody.requestId).toBeTruthy();
    }

    if (responseBody.status) {
      expect(responseBody.status).toBeTruthy();
    }

  });

});
