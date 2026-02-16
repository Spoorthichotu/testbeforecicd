require('dotenv').config();
const { test, expect } = require('@playwright/test');
const config = require('../config/banklistbyname.json');

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.AUTH_TOKEN;

test('Fetch Bank List By Name', async ({ request }) => {

  const countryCode = config.countryCode;
  const currencyCode = config.currencyCode;
  const name = config.name;
  

  const response = await request.get(
    `${BASE_URL}/v1/payout/bankwire/banklistbyname` +
    `?countryCode=${countryCode}` +
    `&currencyCode=${currencyCode}` +
    `&name=${(name)}`,
    {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TOKEN}`
      }
    }
  );

  const status = response.status();
  const body = await response.json();

  expect([200, 201]).toContain(response.status());

});
