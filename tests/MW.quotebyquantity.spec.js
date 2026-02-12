require('dotenv').config();

const { test, expect } = require('@playwright/test');

const quoteConfig = require('../config/MWquoteByQuantity.json');
const submitConfig = require('../config/mobileWalletSubmitOrder.json');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

// Helper: recursively find "quoteId" anywhere in the response
function findQuoteId(obj) {
  if (!obj || typeof obj !== 'object') return undefined;

  for (const key of Object.keys(obj)) {
    if (key.toLowerCase() === 'quoteid') {
      return obj[key];
    }
    const value = obj[key];
    if (typeof value === 'object') {
      const result = findQuoteId(value);
      if (result) return result;
    }
  }
  return undefined;
}

test("Mobile Wallet – QuoteByQuantity → SubmitOrder Flow", async ({ request }) => {

  console.log("========== STEP 1: QUOTE BY QUANTITY ==========");

  const quoteResponse = await request.post(
    `${BASE_URL}/v1/payout/bankwire/quotebyquantity`,
    {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: quoteConfig
    }
  );

  const quoteStatus = quoteResponse.status();
  const quoteBody = await quoteResponse.json().catch(() => ({}));

  console.log("Quote Response:", JSON.stringify(quoteBody, null, 2));

  expect([200, 201]).toContain(quoteStatus);

  // 🔥 Auto-detect quoteId anywhere inside the response
  const quoteId = findQuoteId(quoteBody);

  console.log("Extracted Quote ID:", quoteId);
  expect(quoteId).toBeTruthy();


  console.log("========== STEP 2: SUBMIT ORDER ==========");

  const finalSubmitPayload = {
    ...submitConfig,
    quoteId: quoteId
  };

  console.log("Submit Payload:", JSON.stringify(finalSubmitPayload, null, 2));

  const submitResponse = await request.post(
    `${BASE_URL}/v1/payout/bankwire/submitOrder/wallet`,
    {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: finalSubmitPayload
    }
  );

  const submitStatus = submitResponse.status();
  const submitBody = await submitResponse.json().catch(() => ({}));

  console.log("Submit Response:", JSON.stringify(submitBody, null, 2));

  expect([200, 201]).toContain(submitStatus);

});
