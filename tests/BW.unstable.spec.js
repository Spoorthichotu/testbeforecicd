require('dotenv').config();
const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');
const config = require('../config/BWunstable.json'); 

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

test('Bankwire Payout – Submit Order (Using Config JSON + Dynamic Data)', async ({ request }) => {

  
  const submitPayload = {
    transactionType: config.transactionType,
    quantity: faker.number.int({ min: 100, max: 500 }),
    sourceOfFunds: config.sourceOfFunds,
    userEmail: config.userEmail,
    coin: config.coin,
    recipientRelationship: config.recipientRelationship,
    remittancePurpose: config.remittancePurpose,
    transferType: config.transferType,
    msisdn: config.msisdn,
    accountNo: config.accountNo,
    payment_source: config.payment_source,
    sendingCurrency: config.sendingCurrency,
    receivingCurrency: config.receivingCurrency,
    receivingCountry: config.receivingCountry,
    sendingCountry: config.sendingCountry,
    receiver_firstName: config.receiver_firstName,
    receiver_lastName: config.receiver_lastName,
    feeType: config.feeType
  };

  console.log("Submit Payload:", JSON.stringify(submitPayload, null, 2));

  
  const submitResponse = await request.post(
    `${BASE_URL}/v1/payout/bankwire/submitOrder/bank/unstable`,
    {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: submitPayload
    }
  );

  const status = submitResponse.status();
  const body = await submitResponse.json();

  console.log("Status:", status);
  console.log("Submit Response:", JSON.stringify(body, null, 2));

  expect([200, 201]).toContain(status);
});
