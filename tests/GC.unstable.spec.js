require('dotenv').config();
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

const quotePayload = require('../config/giftcardunstableQuote.json');

test.describe('Giftcard Quote → Giftcard Order flow', () => {

  test('Generate giftcard quote and place order', async ({ request }) => {

    // ---------- STEP 1: CREATE GIFTCARD QUOTE ----------
    console.log('Creating giftcard quote with payload:');
    console.log(JSON.stringify(quotePayload, null, 2));

    const quoteResponse = await request.post(
      `${BASE_URL}/v1/payout/giftcard/quote/unstable`,
      {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`
        },
        data: quotePayload
      }
    );

    const quoteStatus = quoteResponse.status();
    const quoteBody = await quoteResponse.json();

    console.log('Quote Status:', quoteStatus);
    console.log('Quote Response:', JSON.stringify(quoteBody, null, 2));

    // Quote can return 200 or 201
    expect([200, 201]).toContain(quoteStatus);

    // ---------- STEP 2: EXTRACT quoteId ----------
    const quoteId = quoteBody?.quoteId || quoteBody?.quote?.quoteId;
    console.log('Extracted Quote ID:', quoteId);
    expect(quoteId).toBeTruthy();

    // ---------- STEP 3: PLACE GIFTCARD ORDER ----------
    const orderResponse = await request.post(
      `${BASE_URL}/v1/payout/giftcard/order/unstable`,
      {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`
        },
        data: { quoteId }
      }
    );

    const orderStatus = orderResponse.status();
    const orderBody = await orderResponse.json();

    console.log('Order Status:', orderStatus);
    console.log('Order Response:', JSON.stringify(orderBody, null, 2));

    // Order assertions
    expect([200, 201]).toContain(orderStatus);
    expect(orderBody).toBeDefined();

    // Optional safety checks
    if (orderBody.orderId) {
      expect(orderBody.orderId).toBeTruthy();
    }

    if (orderBody.status) {
      expect(orderBody.status).toBeTruthy();
    }
  });

});
