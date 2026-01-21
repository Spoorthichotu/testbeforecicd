require('dotenv').config();
const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker'); // for dynamic data

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

// Load config JSON
const config = require('../config/estimatedQuote.json');

test("POST Estimated Quote by Amount – Bankwire (Dynamic Amount)", async ({ request }) => {
  // Dynamically change the amount
  config.amount = faker.number.int({ min: 100, max: 500 }); // random amount between 100–5000


  const response = await request.post(
    `${BASE_URL}/v1/payout/bankwire/estimatedquotebyamount`,
    {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: config, // ✅ use config here
    }
  );

  const status = response.status();
  const resBody = await response.json();

  console.log("Dynamic Request Payload:", JSON.stringify(config, null, 2));
  console.log("Estimated Quote Status:", status);
  console.log("Estimated Quote Response:", JSON.stringify(resBody, null, 2));

  expect([200, 201]).toContain(status);
});
