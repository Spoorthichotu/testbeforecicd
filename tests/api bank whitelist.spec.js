require('dotenv').config(); // loads .env file

const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

test("Whitelist Bank Account (POST)", async ({ request }) => {
  const response = await request.post(
    `${BASE_URL}/v1/partners/user/forensics/whitelist/bankAccount`,
    {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: {
        accountHolderName: "John Doe",
        accountType: "Savings",
        mobile: "1234567890",
        provider: "BankProvider",
        accountHolderAddress: "123 Main Street, City",
        beneficiaryBankName: "Bank of Test",
        beneficiaryBankAddress: "456 Bank Road, City",
        beneficiaryBankCountry: "US",
        bankAccountNumber: "673456782099267",
        bicSwift: "TESTUS99",
        bankcode: "001",
        banksubcode: "002",
        country: "BR",
        fiatCurrency: "BRL",
        userEmail: "testuser@example6.com"
      }
    }
  );

   const status = response.status();
  const resBody = await response.json();

  console.log("Response Status:", status);
  console.log("Response Body:", JSON.stringify(resBody, null, 2));

  expect([200, 409]).toContain(status);
});


