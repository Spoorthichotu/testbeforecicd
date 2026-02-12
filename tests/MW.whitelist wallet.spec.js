require('dotenv').config();

const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

// Load config data
const config = require('../config/whitelistMobileWallet.json');

// Environment variables
const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

// Debug logs
console.log("BASE_URL:", BASE_URL);
console.log("AUTH_TOKEN exists:", !!TOKEN);

// =======================================
// ✅ POSITIVE TEST
// =======================================
test("Whitelist Mobile Wallet (POST) - Dynamic Data", async ({ request }) => {

  const payload = {
    walletHolderName: config.walletHolderName,
    mobile: config.mobile,
    provider: config.provider,
    country: config.country,
    fiatCurrency: config.fiatCurrency || "ALL",
    userEmail: config.userEmail
    
  };

  const response = await request.post(
    `${BASE_URL}/v1/partners/user/forensics/whitelist/mobileWallet`,
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


// =======================================
// ❌ NEGATIVE TEST (mobile & provider empty)
// =======================================
test("Whitelist Mobile Wallet - Mobile & Provider Empty", async ({ request }) => {

  const payload = {
    walletHolderName: config.walletHolderName,
    mobile: "",               // ❌ empty
    provider: "",             // ❌ empty
    country: config.country,
    fiatCurrency: config.fiatCurrency,
    userEmail: config.userEmail
  };

  const response = await request.post(
    `${BASE_URL}/v1/partners/user/forensics/whitelist/mobileWallet`,
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

  expect(status).toBe(500);
});
