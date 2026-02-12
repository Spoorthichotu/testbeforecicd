require('dotenv').config();
const { test, expect } = require('@playwright/test');
const config = require('../config/Banklist.json');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

test('Fetch Bank List for a Country', async ({ request }) => {

  // Fetch country code from JSON config
  const countryCode = config.countryCode; 

  // GET request 
  const response = await request.get(
    `${BASE_URL}/v1/payout/bankwire/banklist?countryCode=${countryCode}`,
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
  console.log("Bank List Response:", JSON.stringify(body, null, 2));

  expect(status).toBe(200);
  expect(body).toBeDefined();
});
