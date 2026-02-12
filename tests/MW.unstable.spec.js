require('dotenv').config();
const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');
const config = require('../config/walletunstable.json');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

test('Wallet Payout – Submit Order (Dynamic Data)', async ({ request }) => {

  // 🔹 Build payload using config + dynamic faker values
  const submitPayload = {
    transactionType: config.transactionType,
    quantity: faker.number.int({ min: 100, max: 5000 }),
    sourceOfFunds: config.sourceOfFunds,
    userEmail: config.userEmail,
    coin: config.coin,
    recipientRelationship: config.recipientRelationship,
    remittancePurpose: config.remittancePurpose,
    transferType: config.transferType,
    msisdn: config.msisdn,
    accountNo: config.accountNo,
    sendingCurrency: config.sendingCurrency,
    receivingCurrency: config.receivingCurrency,
    receivingCountry: config.receivingCountry,
    sendingCountry: config.sendingCountry,
    receiver_firstName: config.receiver_firstName,
    receiver_lastName: config.receiver_lastName,
    sender_msisdn: config.sender_msisdn,
    receiver_msisdn: config.receiver_msisdn,
    walletProviderName: config.walletProviderName,
    walletProviderCode: config.walletProviderCode,
    feeType: config.feeType,
    payment_source: config.payment_source
  };

  console.log("Submit Wallet Payload:", JSON.stringify(submitPayload, null, 2));

  // =========================================================
  // SUBMIT ORDER API CALL
  // =========================================================
  const submitResponse = await request.post(
    `${BASE_URL}/v1/payout/bankwire/submitOrder/wallet/unstable`,
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
  console.log("Submit Wallet Response:", JSON.stringify(body, null, 2));

  expect([200, 201]).toContain(status);
});
