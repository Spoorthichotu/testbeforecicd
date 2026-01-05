require('dotenv').config();
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

test("GET Bankwire Transaction by Order ID", async ({ request }) => {
  const orderId = "12345-abcd-67890-efgh"; // replace as needed
  const url = `${BASE_URL}/v1/payout/bankwire/transaction/${orderId}`;

  const response = await request.get(url, {
    headers: { accept: '*/*', Authorization: `Bearer ${TOKEN}` },
  });

  const status = response.status();
  console.log("Transaction Status:", status);

  if (status === 200) {
    const resBody = await response.json();
    console.log("Transaction Response:", JSON.stringify(resBody, null, 2));
    
  } else if (status === 404) {
    const resBody = await response.json(); // get backend message
    console.log(`Order not found. Backend Response:`, JSON.stringify(resBody, null, 2));
    expect(status).toBe(404); // ✅ Pass test for 404
  } else {
    const resBody = await response.text();
    console.log(`Unexpected status code: ${status}`, resBody);
    expect(status).toBe(200); // fail test for any other status
  }
});
