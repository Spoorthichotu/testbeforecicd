require('dotenv').config();
const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

const orderConfig = require('../config/MTOrder.json');

test.describe('GET /v1/topup/order/:orderId', () => {

  test('VALID orderId (from config)', async ({ request }) => {

    const validOrderId = orderConfig.orderId;

    if (!validOrderId) {
      throw new Error('VALID orderId is missing in config/MTOrder.json');
    }

    console.log('Using VALID orderId:', validOrderId);

    const response = await request.get(
      `${BASE_URL}/v1/topup/order/${validOrderId}`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${TOKEN}`
        }
      }
    );

    const status = response.status();
    const resBody = await response.json();

    console.log("\n===== VALID ORDER RESPONSE =====");
    console.log(JSON.stringify(resBody, null, 2));

    // TEMP: only status assertion until real structure is known
    expect(status).toBe(201);
  });


});
