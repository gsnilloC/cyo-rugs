const { Client, Environment } = require("square");
require("dotenv").config();

const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

const bigIntReplacer = (key, value) => {
  if (typeof value === "bigint") {
    return value.toString();
  }
  return value;
};

async function createCheckout(cartItems) {
  try {
    const lineItems = cartItems.map((item) => ({
      name: item.name,
      quantity: item.quantity.toString(),
      basePriceMoney: {
        amount: item.price * 100,
        currency: "USD",
      },
    }));

    const orderRequest = {
      idempotency_key: Date.now().toString(),
      order: {
        locationId: process.env.SQUARE_LOCATION_ID,
        lineItems: lineItems,
      },
      checkoutOptions: {
        redirectUrl: "http://localhost:3000/shop",
      },
    };

    const response = await client.checkoutApi.createPaymentLink(orderRequest);

    const paymentLink = response.result.paymentLink;
    return paymentLink?.url || null;
  } catch (error) {
    console.log("Error creating checkout:", error);
    throw error;
  }
}

const testCreateCheckout = async () => {
  // try {
  //   const cartItems = [{ name: "Majestic Queen", quantity: 1, price: 8000 }];
  //   const checkoutUrl = await createCheckout(cartItems);
  // } catch (error) {
  //   console.error("Error creating checkout link:", error);
  // }
};

const getImageUrls = async (imageIds) => {
  const imageUrls = await Promise.all(
    imageIds.map(async (imageId) => {
      const imageResponse = await client.catalogApi.retrieveCatalogObject(
        imageId
      );
      return imageResponse.result.object.imageData.url;
    })
  );
  return imageUrls;
};

const listItems = async () => {
  const response = await client.catalogApi.listCatalog();
  const items = response.result.objects;

  return await Promise.all(
    items.map(async (item) => {
      const priceBigInt =
        item.itemData.variations[0].itemVariationData.priceMoney.amount;
      const formattedPrice = Number(priceBigInt) / 100;

      const imageIds = item.itemData.imageIds || [];
      const imageUrls = imageIds.length > 0 ? await getImageUrls(imageIds) : [];

      return {
        id: item.id,
        name: item.itemData.name,
        description: item.itemData.description,
        price: formattedPrice,
        imageUrls: imageUrls,
      };
    })
  );
};

const getItemById = async (id) => {
  try {
    const response = await client.catalogApi.retrieveCatalogObject(id);
    const item = response.result.object;

    if (!item || !item.itemData) {
      return null;
    }

    const priceBigInt =
      item.itemData.variations[0].itemVariationData.priceMoney.amount;
    const formattedPrice = Number(priceBigInt) / 100;

    const imageIds = item.itemData.imageIds || [];
    const imageUrls = imageIds.length > 0 ? await getImageUrls(imageIds) : [];

    return {
      id: item.id,
      name: item.itemData.name,
      description: item.itemData.description,
      price: formattedPrice,
      imageUrls: imageUrls,
    };
  } catch (error) {
    console.error("Error retrieving item by ID:", error);
    throw error;
  }
};

const testSquareApi = async () => {
  try {
    console.log("Square API is working.");
  } catch (error) {
    console.error("Error testing Square API:", error);
  }
};

module.exports = {
  listItems,
  getItemById,
  testSquareApi,
  createCheckout,
  testCreateCheckout,
};
