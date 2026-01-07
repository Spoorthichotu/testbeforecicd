require('dotenv').config();
const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');
const config = require('../config/bankwireQuote.json');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

test('Bankwire Payout – Quote by amount → Submit Order (Dynamic Data)', async ({ request }) => {

  // 🔹 Generate dynamic test data
  const quotePayload = {
  userEmail: config.userEmail,
  coin: config.coin,
  recipientRelationship: config.recipientRelationship,
  remittancePurpose: config.remittancePurpose,
  transferType: config.transferType,
  msisdn: faker.phone.number('+63##########'),
  accountNo: config.accountNo, // ✅ fix for v10+
  sendingCurrency: config.sendingCurrency,
  receivingCurrency: config.receivingCurrency,
  receivingCountry: config.receivingCountry,
  sendingCountry: config.sendingCountry,
  amount: faker.number.int({ min: 100, max: 5000 }),
  transactionType: config.transactionType,
  sourceOfFunds: config.sourceOfFunds,
  sender_msisdn: faker.phone.number('+63##########'),
  receiver_msisdn: faker.phone.number('+63##########'),
  receiver_firstName: faker.person.firstName(),
  receiver_lastName: faker.person.lastName()
};


  // =========================================================
  // STEP 1: Generate Quote
  // =========================================================
  const quoteResponse = await request.post(
    `${BASE_URL}/v1/payout/bankwire/quotebyamount`,
    {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: quotePayload
    }
  );

  const quoteStatus = quoteResponse.status();
  const quoteBody = await quoteResponse.json();

  console.log('Quote Payload:', JSON.stringify(quotePayload, null, 2));
  console.log('Quote Status:', quoteStatus);
  console.log('Quote Response:', JSON.stringify(quoteBody, null, 2));

  expect([200, 201]).toContain(quoteStatus);

  // =========================================================
  // STEP 2: Extract quoteId
  // =========================================================
  const quoteId = quoteBody?.quote?.quoteId;
  console.log('Extracted Quote ID:', quoteId);
  expect(quoteId).toBeTruthy();

  // =========================================================
  // STEP 3: Submit Order using Quote ID
  // =========================================================
  const submitResponse = await request.post(
    `${BASE_URL}/v1/payout/bankwire/submitOrder/bank`,
    {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: { quoteId: quoteId }
    }
  );

  const submitStatus = submitResponse.status();
  const submitBody = await submitResponse.json();

  console.log('Status:', submitStatus);
  console.log('Response:', JSON.stringify(submitBody, null, 2));

  expect([200]).toContain(submitStatus);
});
