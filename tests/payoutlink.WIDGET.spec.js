require('dotenv').config();
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

test.describe('GET /v1/partners/generate/payoutlink', () => {

  test('VALID request - Generate payout link', async ({ request }) => {

    const response = await request.get(
      `${BASE_URL}/v1/partners/generate/payoutlink`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const status = response.status();
    const resBody = await response.json();

    console.log("\n===== VALID RESPONSE =====");
    console.log(JSON.stringify(resBody, null, 2));

    // Temporary base assertions — customize once you show me the real body
    expect(status).toBe(200);   // or 201 depending on API
    expect(resBody).toBeDefined();

    // Uncomment when we see the real structure:
    // expect(resBody.success).toBe(true);
    // expect(resBody.data.link).toBeDefined();
  });


});
