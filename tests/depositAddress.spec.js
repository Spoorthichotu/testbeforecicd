require('dotenv').config();
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

// Load query params from JSON
const depositData = require('../config/depositAddress.json');

test.describe('GET /v1/getDepositAddress', () => {

  test('Fetch deposit address with user_id & coin', async ({ request }) => {

    const { user_id, coin } = depositData;

    if (!coin) throw new Error("coin is required in config/depositAddress.json");

    console.log('Fetching Deposit Address for:', { user_id, coin });

    const response = await request.get(
      `${BASE_URL}/v1/getDepositAddress`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TOKEN}`
        },
        params: {
          user_id,
          coin
        }
      }
    );

    const status = response.status();
    const body = await response.json();

    console.log("\n===== DEPOSIT ADDRESS RESPONSE =====");
    console.log(JSON.stringify(body, null, 2));

    expect(status).toBe(201);
    expect(body).toBeTruthy();
  });

});
