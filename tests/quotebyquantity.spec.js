require('dotenv').config(); // load .env

const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

test('Bankwire Payout – Quote by Quantity → Submit Order', async ({ request }) => {

  /* =========================================================
     STEP 1: Generate Quote
  ========================================================= */
  const quoteResponse = await request.post(
    `${BASE_URL}/v1/payout/bankwire/quotebyquantity`,
    {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: {
        userEmail: "spoorthi2003@gmail.com",
        coin: "USDC",
        recipientRelationship: "Self",
        remittancePurpose: "Gift",
        transferType: "BANK",
        msisdn: "+633698701234",
        accountNo: "002740204357",
        sendingCurrency: "USD",
        receivingCurrency: "PHP",
        receivingCountry: "PH",
        sendingCountry: "US",
        quantity: 100,
        transactionType: "p2p",
        sourceOfFunds: "Salary",
        sender_msisdn: "+633698701234",
        receiver_msisdn: "+633698701234",
        receiver_firstName: "GINA MARIA",
        receiver_lastName: "B ABRACIA",
      },
    }
  );

  const quoteStatus = quoteResponse.status();
  const quoteBody = await quoteResponse.json();

  console.log('Quote Status:', quoteStatus);
  console.log('Quote Response:', JSON.stringify(quoteBody, null, 2));

  expect([200, 201]).toContain(quoteStatus);


  /* =========================================================
     STEP 2: Extract quoteId from the correct nested path
  ========================================================= */
  const quoteId = quoteBody?.quote?.quoteId;
  console.log('Extracted Quote ID:', quoteId);
  expect(quoteId).toBeTruthy(); // fail if backend did not return quoteId

  /* =========================================================
     STEP 3: Submit Order using Quote ID
  ========================================================= */
  const submitResponse = await request.post(
    `${BASE_URL}/v1/payout/bankwire/submitOrder/bank`,
    {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: {
        quoteId: quoteId,
      },
    }
  );

  const submitStatus = submitResponse.status();
  const submitBody = await submitResponse.json();

  console.log('Submit Status:', submitStatus);
  console.log('Submit Response:', JSON.stringify(submitBody, null, 2));

  expect([200]).toContain(submitStatus);
});
