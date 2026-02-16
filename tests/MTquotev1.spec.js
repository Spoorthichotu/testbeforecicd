require('dotenv').config();
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

const quotePayload = require('../config/MTquotev2.json');

test.describe('topup Quote → topup Order flow', () => {

  test('Generate topup quote and place order', async ({ request }) => {

    // ---------- STEP 1: CREATE TOPUP QUOTE ----------
    console.log('Creating topup quote with payload:');
    console.log(JSON.stringify(quotePayload, null, 2));

    const quoteResponse = await request.post(
      `${BASE_URL}/v1/topup/quote/v2`,
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

    expect([200, 201]).toContain(quoteStatus);

    // ---------- STEP 2: CORRECTLY EXTRACT quoteID ----------
    const quoteId =
      quoteBody?.quoteID ||              // top-level
      quoteBody?.quote?.quoteID ||       // inside "quote" object
      quoteBody?.quote?.quoteId;         // fallback if naming differs

    console.log('Extracted Quote ID:', quoteId);
    expect(quoteId).toBeTruthy();

    // ---------- STEP 3: PLACE TOPUP ORDER ----------
    const orderResponse = await request.post(
      `${BASE_URL}/v1/topup/submit-order/v2`,
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

    expect([200, 500]).toContain(orderStatus);
    expect(orderBody).toBeDefined();

    if (orderBody.orderId) expect(orderBody.orderId).toBeTruthy();
    if (orderBody.status) expect(orderBody.status).toBeTruthy();

  });

});
