require('dotenv').config();
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

// Load query params from JSON file
const startKYCPayload = require('../config/individualStartKYC.json');

test.describe('Partner KYC → Start KYC', () => {

  test('Start individual KYC process', async ({ request }) => {

    console.log('Start KYC Query Params:');
    console.log(JSON.stringify(startKYCPayload, null, 2));

    // ---------- STEP 1: GET REQUEST WITH QUERY PARAMS ----------
    const response = await request.get(
      `${BASE_URL}/v1/partners/kyc/individual/startKYC`,
      {
        headers: {
          accept: '*/*',
          Authorization: `Bearer ${TOKEN}`
        },
        params: {
          partnerUserId: startKYCPayload.partnerUserId,
          documentType: startKYCPayload.documentType
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
