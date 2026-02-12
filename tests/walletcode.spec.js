require('dotenv').config();
const { test, expect } = require('@playwright/test');
const config = require('../config/walletcode.json');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

test('Fetch Wallet Codes for a Country', async ({ request }) => {

  // Fetch country code from JSON config
  const countryCode = config.countryCode;

  // Make GET request to walletCodes endpoint
  const response = await request.get(
    `${BASE_URL}/v1/payout/bankwire/walletCodes?countryCode=${countryCode}`,
    {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TOKEN}`
      }
    }
  );

  const status = response.status();
  const body = await response.json();

  console.log("Status:", status);
  console.log("Wallet Codes Response:", JSON.stringify(body, null, 2));

  expect(status).toBe(200);
  expect(body).toBeDefined();
});
