const { Client, Environment } = require("square");

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
    // Prepare the order line items for Square API
    const lineItems = cartItems.map((item) => ({
      name: item.name,
      quantity: item.quantity.toString(), // Square API expects quantity as a string
      basePriceMoney: {
        amount: item.price * 100, // Convert price to cents for the Square API
        currency: "USD",
      },
    }));

    // Create the order object for Square
    const orderRequest = {
      idempotency_key: Date.now().toString(), // Ensure request uniqueness
      order: {
        locationId: process.env.SQUARE_LOCATION_ID,
        lineItems: lineItems,
      },
      checkoutOptions: {
        redirectUrl: "http://localhost:3000/shop", // Redirect to your homepage after payment
      },
    };

    // Send the order creation request to Square and get the payment link
    const response = await client.checkoutApi.createPaymentLink(orderRequest);

    console.log(
      "Response from Square API:",
      JSON.stringify(response, bigIntReplacer, 2)
    );

    // Return the payment link URL if available
    const paymentLink = response.result.paymentLink;
    return paymentLink?.url || null;
  } catch (error) {
    console.log("Error creating checkout:", error);
    throw error;
  }
}

// Example function to create an order and log the URL
const testCreateCheckout = async () => {
  try {
    const cartItems = [
      { name: "Glorious King", quantity: 2, price: 12500 }, // Example cart items
      { name: "Majestic Queen", quantity: 1, price: 8000 },
    ];

    const checkoutUrl = await createCheckout(cartItems);
    console.log("Checkout URL:", checkoutUrl); // Log the checkout URL
  } catch (error) {
    console.error("Error creating checkout link:", error);
  }
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
