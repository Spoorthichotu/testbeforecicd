require('dotenv').config();
const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

// Static email for duplicate check
const STATIC_EMAIL = "spoorthi2003@gmail.com";

test("Create User: dynamic email and test duplicate with static email", async ({ request }) => {
  
  // ---- Dynamic email: first request ----
  const dynamicEmail = faker.internet.email();
  let response = await request.post(
    `${BASE_URL}/v1/partners/create/user`,
    {
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: { email: dynamicEmail }
    }
  );

  let resBody = await response.json();
  let status = response.status();

  console.log("Dynamic Email Request Status:", status); // should be 201
  console.log("Dynamic Email Request Body:", JSON.stringify(resBody, null, 2));
  expect(status).toBe(201);

  // ---- Static email: second request to test 409 ----
  response = await request.post(
    `${BASE_URL}/v1/partners/create/user`,
    {
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: { email: STATIC_EMAIL }
    }
  );

  resBody = await response.json();
  status = response.status();

  console.log("Static Email Request Status:", status); // should be 409
  console.log("Static Email Request Body:", JSON.stringify(resBody, null, 2));
  expect(status).toBe(409);
});
