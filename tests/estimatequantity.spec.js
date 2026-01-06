require('dotenv').config(); // load .env file

const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

test("POST Estimated Quote by Quantity – Bankwire", async ({ request }) => {

  const response = await request.post(
    `${BASE_URL}/v1/payout/bankwire/estimatedquotebyquantity`,
    {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: {
        coin: "USDC",
        transferType: "BANK",
        sendingCurrency: "USD",
        receivingCurrency: "MXN",
        receivingCountry: "MX",
        sendingCountry: "AU",
        quantity: 100,
        userEmail: "string"
      },
    }
  );

  const status = response.status();
  const resBody = await response.json();

  console.log("Estimated Quote Status:", status);
  console.log("Estimated Quote Response:", JSON.stringify(resBody, null, 2));

  // ✅ API may return 200 or 201 depending on implementation
  expect([200, 201]).toContain(status);
  
});
