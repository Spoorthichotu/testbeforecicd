require('dotenv').config();

const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

// Load config data
const config = require('../config/whitelistBankAccount.json');

// Environment variables
const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

// Safety check (helps debugging CI issues)
console.log("BASE_URL:", BASE_URL);
console.log("AUTH_TOKEN exists:", !!TOKEN);

test("Whitelist Bank Account (POST) - Dynamic Data", async ({ request }) => {

  const payload = {
    accountHolderName: faker.person.fullName(),
    accountType: config.accountType,
    mobile: faker.phone.number('##########'),
    provider: config.provider,
    accountHolderAddress: faker.location.streetAddress(),
    beneficiaryBankName: faker.company.name(),
    beneficiaryBankAddress: faker.location.streetAddress(),
    beneficiaryBankCountry: config.beneficiaryBankCountry,
    bankAccountNumber: faker.finance.accountNumber(16),
    bicSwift: faker.finance.bic(),
    bankcode: faker.finance.routingNumber(),
    banksubcode: faker.string.numeric(3),
    country: config.country,
    fiatCurrency: config.fiatCurrency,
    userEmail: config.userEmail
  };

  const response = await request.post(
    `${BASE_URL}/v1/partners/user/forensics/whitelist/bankAccount`,
    {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: payload
    }
  );

  const status = response.status();
  const contentType = response.headers()['content-type'];

  let resBody;
  if (contentType && contentType.includes('application/json')) {
    resBody = await response.json();
  } else {
    resBody = await response.text();
  }

  console.log("========== POSITIVE TEST ==========");
  console.log("Request Payload:", JSON.stringify(payload, null, 2));
  console.log("Response Status:", status);
  console.log("Response Body:", resBody);

  // API may return 200 (success) or 409 (already whitelisted)
  expect([200, 409]).toContain(status);
});

test("Whitelist Bank Account - Bank Name & Account Number Empty", async ({ request }) => {

  const payload = {
    accountHolderName: faker.person.fullName(),
    accountType: config.accountType,
    mobile: faker.phone.number('##########'),
    provider: config.provider,
    accountHolderAddress: faker.location.streetAddress(),
    beneficiaryBankName: "", // ❌ empty
    beneficiaryBankAddress: faker.location.streetAddress(),
    beneficiaryBankCountry: config.beneficiaryBankCountry,
    bankAccountNumber: "", // ❌ empty
    bicSwift: faker.finance.bic(),
    bankcode: faker.finance.routingNumber(),
    banksubcode: faker.string.numeric(3),
    country: config.country,
    fiatCurrency: config.fiatCurrency,
    userEmail: faker.internet.email()
  };

  const response = await request.post(
    `${BASE_URL}/v1/partners/user/forensics/whitelist/bankAccount`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: payload
    }
  );

  const status = response.status();
  const contentType = response.headers()['content-type'];

  let resBody;
  if (contentType && contentType.includes('application/json')) {
    resBody = await response.json();
  } else {
    resBody = await response.text();
  }

  console.log("========== NEGATIVE TEST ==========");
  console.log("Request Payload:", JSON.stringify(payload, null, 2));
  console.log("Response Status:", status);
  console.log("Response Body:", resBody);

  expect(status).toBe(400);
});
