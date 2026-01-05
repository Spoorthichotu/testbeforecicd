require('dotenv').config(); // loads .env file

const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

test("Create User (POST)", async ({ request }) => {
  const response = await request.post(
    `${BASE_URL}/v1/partners/create/user`,
    {
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${TOKEN}`, 
        'Content-Type': 'application/json'
      },
      data: {
        email: "testuser@example6.com" // replace with dynamic value if needed
      }
    }
  );

  const resBody = await response.json();
  console.log("Response Status:", response.status());
  console.log("Response Body:", JSON.stringify(resBody, null, 2));

  expect([201, 409]).toContain(status);

});
