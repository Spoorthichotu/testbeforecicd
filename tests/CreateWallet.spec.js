require('dotenv').config();
const { test, expect } = require('@playwright/test');
const walletData = require('../config/PayinCreatewallet.json');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

test('Create Fiat Wallet', async ({ request }) => {

  // POST request payload from JSON file
  const payload = {
    userEmail: walletData.userEmail,
    currency_code: walletData.currency_code,
    postal_code: walletData.postal_code
  };

  // Make POST request
  const response = await request.post(`${BASE_URL}/v1/payin/fiat_wallet/wallets`, {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`
    },
    data: payload
  });

  const status = response.status();
  const body = await response.json();

  console.log("Status:", status);
  console.log("Create Wallet Response:", JSON.stringify(body, null, 2));

  // Assertions
  expect(status).toBe(200);          // adjust if API returns 201 or 202
  expect(body).toBeDefined();
  expect(body.wallet_id || body.data).toBeTruthy();
});
