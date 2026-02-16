require('dotenv').config();
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

// Load query params from JSON file
const importKycPayload = require('../config/individualImportKyc.json');

test.describe('Partner KYC → Import KYC', () => {

  test('Import individual KYC using share token', async ({ request }) => {

    console.log('Import KYC Query Params:');
    console.log(JSON.stringify(importKycPayload, null, 2));

    // ---------- STEP 1: GET REQUEST WITH QUERY PARAMETERS ----------
    const response = await request.get(
      `${BASE_URL}/v1/partners/kyc/individual/importKyc`,
      {
        headers: {
          accept: '*/*',
          Authorization: `Bearer ${TOKEN}`
        },
        params: {
          shareToken: importKycPayload.shareToken,
          userEmail: importKycPayload.userEmail
        }
      }
    );

    const status = response.status();
    const responseBody = await response.json();

    console.log('Status:', status);
    console.log('Response:', JSON.stringify(responseBody, null, 2));

    // ---------- STEP 2: ASSERTIONS ----------
    expect([200, 201]).toContain(status);
    expect(responseBody).toBeDefined();

    if (responseBody.requestId) {
      expect(responseBody.requestId).toBeTruthy();
    }

  });

});
