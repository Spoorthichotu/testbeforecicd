require('dotenv').config();
const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

const BASE_URL = process.env.BASE_URL;

// Shared object to reuse success payload for duplicate test
let successPayload;

test.describe('Partner Onboarding API - All Scenarios', () => {

  /*=========================================================
     1️ SUCCESS – Dynamic onboarding
  ========================================================= */
  test('Successful onboarding with dynamic data', async ({ request }) => {

    successPayload = {
      enterpriseName: `Encryptus-${faker.company.name()}`,
      clientRepresentiveEmail: faker.internet.email().toLowerCase(),
      clientRepresentivePassword: faker.internet.password(16),
      clientRepresentivePhoneNo: `+91${faker.phone.number('##########')}`,
      enterpriseLocation: faker.location.city(),
      grant_services: ["FORENSICS"]
    };

    const response = await request.post(
      `${BASE_URL}/v1/partners/onboarding`,
      { data: successPayload }
    );

    const resBody = await response.json();
    console.log("Success onboarding response:", resBody);

    expect(response.status()).toBe(200);
    expect(resBody.success).toBe(true);
  });

  /* =========================================================
     2️ DUPLICATE – Same data again
  ========================================================= */
  test('Duplicate onboarding should fail', async ({ request }) => {

    const response = await request.post(
      `${BASE_URL}/v1/partners/onboarding`,
      { data: successPayload }
    );

    const resBody = await response.json();
    console.log("Duplicate onboarding response:", resBody);

    expect(response.status()).toBe(400);
    expect(resBody.success).toBe(false);
    expect(resBody.code).toBe("EN-STATE-004");
    expect(resBody.data.onboarded).toBe(false);
  });

  /* =========================================================
     3️⃣ VALIDATION – Invalid inputs
  ========================================================= */
  test('Validation errors should return EN-DATA-009', async ({ request }) => {

    const invalidPayload = {
      enterpriseName: "",
      clientRepresentiveEmail: "invalidEmail",
      clientRepresentivePassword: "123",
      clientRepresentivePhoneNo: "12345",
      enterpriseLocation: "",
      grant_services: ["INVALID_SERVICE"]
    };

    const response = await request.post(
      `${BASE_URL}/v1/partners/onboarding`,
      { data: invalidPayload }
    );

    const resBody = await response.json();
    console.log("Validation error response:", resBody);

    expect(response.status()).toBe(400);
    expect(resBody.code).toBe("EN-DATA-009");
    expect(resBody.message).toBe("Bad Request");
  });

});
