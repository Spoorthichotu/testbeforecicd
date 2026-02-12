require('dotenv').config();
const { test, expect } = require('@playwright/test');
const config = require('../config/GetUserWallets.json');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

test('Fetch all fiat wallets for a user', async ({ request }) => {

  // Read from JSON config
  const userEmail = config.userEmail;

  const url = `${BASE_URL}/v1/payin/fiat_wallet/wallets?userEmail=${encodeURIComponent(userEmail)}`;

  // Make GET request
  const response = await request.get(url, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TOKEN}`
    }
  });

  const status = response.status();
  const body = await response.json();

  console.log("Status:", status);
  console.log("User Wallets Response:", JSON.stringify(body, null, 2));

  // Assertions
  expect(status).toBe(200);
  expect(body).toBeDefined();
  expect(Array.isArray(body.data) || typeof body === 'object').toBeTruthy();
});
