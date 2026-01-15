require('dotenv').config();
const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

// Load config JSON
const config = require('../config/fecthallBankwire.json');

/* ================= VALID userEmail ================= */
test('POST Fetch Whitelisted BankAccount – VALID userEmail', async ({ request }) => {

  const payload = {
    userEmail: config.validUserEmail
  };

  const response = await request.post(
    `${BASE_URL}/v1/partners/user/forensics/fetchAll/whitelisted/BankAccount`,
    {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: payload,
    }
  );

  const status = response.status();
  const resBody = await response.json();

  console.log('VALID Request Payload:', JSON.stringify(payload, null, 2));
  console.log('Status:', status);
  console.log('Response:', JSON.stringify(resBody, null, 2));

  expect(status).toBe(200);
});

/* ================= INVALID userEmail ================= */
test('POST Fetch Whitelisted BankAccount – INVALID userEmail', async ({ request }) => {

  const payload = {
    userEmail: faker.internet.email().toLowerCase()
  };

  const response = await request.post(
    `${BASE_URL}/v1/partners/user/forensics/fetchAll/whitelisted/BankAccount`,
    {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: payload,
    }
  );

  const status = response.status();
  const resBody = await response.json();

  console.log('INVALID Request Payload:', JSON.stringify(payload, null, 2));
  console.log('Status:', status);
  console.log('Response:', JSON.stringify(resBody, null, 2));

  expect([400, 404]).toContain(status);
});
