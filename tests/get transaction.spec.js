require('dotenv').config(); // load .env file

const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

test("POST Whitelisted Bank Accounts by User Email", async ({ request }) => {

  const userEmail = "spoorthi2003@gmail.com";

  const response = await request.post(
    `${BASE_URL}/v1/partners/user/forensics/fetchAll/whitelisted/BankAccount`,
    {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: { userEmail: userEmail },
    }
  );

  const status = response.status();
  
  expect(status).toBe(200);
  
});
