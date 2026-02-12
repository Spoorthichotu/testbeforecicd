require('dotenv').config();
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

test.describe('GET /v1/payout/giftcard/orders', () => {

  test('VALID request - Fetch giftcard orders', async ({ request }) => {

    const response = await request.get(
      `${BASE_URL}/v1/payout/giftcard/orders`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    const status = response.status();
    const resBody = await response.json();

    console.log("\n===== VALID RESPONSE =====");
    console.log(JSON.stringify(resBody, null, 2));

    // Adjust these based on the valid response you see in logs
    expect(status).toBe(201);
    expect(resBody).toBeDefined();
  });


})
