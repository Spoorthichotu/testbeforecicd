require('dotenv').config();
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;

test.describe('Partner Generate Token API', () => {

  /* =========================================================
     1️ Invalid grant_services enum → EN-DATA-009
  ========================================================= */
  test('Generate token should fail for invalid grant_services', async ({ request }) => {

    const payload = {
      partnerEmail: "spoorthimanjunath17@gmail.com",
      partnerPassword: "mnbvcxzasdfghjkl",
      grant_services: ["FORE"], // invalid enum
      clientID: "30b4ec68-147c-44bd-aae6-e1662d089ab6",
      clientSecret: "04666c54-18fa-438e-919a-532ad2b93269"
    };

    const response = await request.post(
      `${BASE_URL}/v1/partners/generate/token`,
      { data: payload }
    );

    const resBody = await response.json();
    console.log("Invalid grant_services response:", resBody);

    expect(response.status()).toBe(400);
    expect(resBody.success).toBe(false);
    expect(resBody.code).toBe("EN-DATA-009");
  });

  /* =========================================================
     2️ Unregistered partner email → EN-DATA-007
  ========================================================= */
  test('Generate token should fail for unregistered partner email', async ({ request }) => {

    const payload = {
      partnerEmail: "spoorthimanjunat7@gmail.com", // not registered
      partnerPassword: "mnbvcxzasdfghjkl",
      grant_services: ["FORENSICS"],
      clientID: "30b4ec68-147c-44bd-aae6-e1662d089ab6",
      clientSecret: "04666c54-18fa-438e-919a-532ad2b93269"
    };

    const response = await request.post(
      `${BASE_URL}/v1/partners/generate/token`,
      { data: payload }
    );

    const resBody = await response.json();
    console.log("Unregistered email response:", resBody);

    expect(response.status()).toBe(404);
    expect(resBody.success).toBe(false);
    
  });

  /* =========================================================
     3️ Invalid clientID → EN-AUTH-001
  ========================================================= */
  test('Generate token should fail for invalid clientID', async ({ request }) => {

    const payload = {
      partnerEmail: "spoorthimanjunath17@gmail.com",
      partnerPassword: "mnbvcxzasdfghjkl",
      grant_services: ["FORENSICS"],
      clientID: "30b4ec68", // invalid UUID
      clientSecret: "04666c54-18fa-438e-919a-532ad2b93269"
    };

    const response = await request.post(
      `${BASE_URL}/v1/partners/generate/token`,
      { data: payload }
    );

    const resBody = await response.json();
    console.log("Invalid clientID response:", resBody);

    expect(response.status()).toBe(401);
    expect(resBody.success).toBe(false);
    expect(resBody.code).toBe("EN-AUTH-001");
  });

  /* =========================================================
     4️ SUCCESS → Token generated
  ========================================================= */
  test('Generate token successfully with valid details', async ({ request }) => {

    const payload = {
      partnerEmail: "spoorthimanjunath17@gmail.com",
      partnerPassword: "mnbvcxzasdfghjkl",
      grant_services: ["FORENSICS"],
      clientID: "30b4ec68-147c-44bd-aae6-e1662d089ab6",
      clientSecret: "04666c54-18fa-438e-919a-532ad2b93269"
    };

    const response = await request.post(
      `${BASE_URL}/v1/partners/generate/token`,
      { data: payload }
    );

    const resBody = await response.json();
    console.log("Success token response:", resBody);

    expect(response.status()).toBe(200);
    expect(resBody.success).toBe(true);
    expect(resBody.code).toBe("EN-SUCCESS-001");
    expect(resBody.access_token).toBeTruthy();
  });

});
