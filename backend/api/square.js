const { Client, Environment } = require("square");

const client = new Client({
  environment: Environment.Sandbox,
  accessToken:
    process.env.SQUARE_ACCESS_TOKEN ||
    "EAAAl-bQr2mDkp_u8n3pY7Ml8xusiw3Ji03Cdb-Y_KoEva7H3nJsPYe6KpEEDgvS",
});

const listItems = async () => {
  const response = await client.catalogApi.listCatalog();
  return response.result.objects;
};

module.exports = { listItems };
