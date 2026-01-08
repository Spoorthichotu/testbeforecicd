require('dotenv').config();
const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

const BASE_URL = process.env.BASE_URL;

// Will hold the successful payload for duplicate test
let successPayload;

// Function to generate fresh onboarding data
function generateOnboardingPayload() {
  return {
    enterpriseName: `Encryptus-${faker.company.name()}-${faker.number.int({ min: 1000, max: 9999 })}`,
    clientRepresentiveEmail: faker.internet.email().toLowerCase(),
    clientRepresentivePassword: faker.internet.password({ length: 16 }),
    clientRepresentivePhoneNo: `+91${faker.phone.number('##########')}`,
    enterpriseLocation: faker.location.city(),
    grant_services: ["FORENSICS"]
  };
}

// Run tests serially to ensure successPayload is set before duplicate test
test.describe.configure({ mode: 'serial' });

test.describe('Partner Onboarding API - All Scenarios', () => {

  /* =========================================================
     1️⃣ SUCCESS – onboarding (dynamic every run)
  ========================================================= */
  test('Successful onboarding with dynamic data', async ({ request }) => {

    successPayload = generateOnboardingPayload();

    const response = await request.post(
      `${BASE_URL}/v1/partners/onboarding`,
      { data: successPayload }
    );

    const resBody = await response.json();
    console.log('Success onboarding response:', resBody);

    expect(response.status()).toBe(201); // matches actual API
    expect(resBody.apiSuccessRes.success).toBe(true);
    expect(resBody.data.onboarded).toBe(true);
    expect(resBody.apiSuccessRes.code).toBe('EN-SUCCESS-001');
  });

  /* =========================================================
     2️⃣ DUPLICATE – Same data again
  ========================================================= */
  test('Duplicate onboarding should fail', async ({ request }) => {

    expect(successPayload).toBeDefined(); // safety check

    const response = await request.post(
      `${BASE_URL}/v1/partners/onboarding`,
      { data: successPayload }
    );

    const resBody = await response.json();
    console.log('Duplicate onboarding response:', resBody);

    expect(response.status()).toBe(400); // or whatever your API returns for duplicates
    expect(resBody.success).toBe(false);
    expect(resBody.data.onboarded).toBe(false);
    expect(resBody.code).toBe('EN-STATE-004'); // check actual duplicate error code
  });

  /* =========================================================
     3️⃣ VALIDATION – Invalid inputs
  ========================================================= */
  test('Validation errors should return EN-DATA-009', async ({ request }) => {

    const invalidPayload = {
      enterpriseName: "ff",
      clientRepresentiveEmail: "00",
      clientRepresentivePassword: "123",
      clientRepresentivePhoneNo: "12345",
      enterpriseLocation: "d",
      grant_services: ["INVALID_SERVICE"]
    };

    const response = await request.post(
      `${BASE_URL}/v1/partners/onboarding`,
      { data: invalidPayload }
    );

    const resBody = await response.json();
    console.log('Validation error response:', resBody);

    expect(response.status()).toBe(400);
    expect(resBody.code).toBe('EN-DATA-009');
  });

});
