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

async function createCheckout(amount) {
  try {
    const response = await client.checkoutApi.createPaymentLink({
      idempotency_key: Date.now().toString(),
      quickPay: {
        name: "Auto Detailing",
        priceMoney: {
          amount: amount,
          currency: "USD",
        },
        locationId: process.env.SQUARE_LOCATION_ID,
      },
    });

    console.log(
      "Response from Square API:",
      JSON.stringify(response, bigIntReplacer, 2)
    );

    // Check if the payment link was successfully created and return the URL
    const paymentLink = response.result.paymentLink;
    if (paymentLink && paymentLink.url) {
      console.log("Payment Link ID:", paymentLink.id);
      console.log("Order ID:", paymentLink.orderId);
      console.log("Payment Link URL:", paymentLink.url);
      console.log("Created At:", paymentLink.createdAt);
      return paymentLink.url; // Return the checkout URL
    } else {
      console.log("No payment link returned.");
      return null; // Return null if no link is available
    }
  } catch (error) {
    console.log("Error creating checkout:", error);
    throw error; // Propagate the error to the calling function
  }
}

// Example function to create a Quick Pay link and log the URL
const testCreateQuickPay = async () => {
  try {
    const checkoutUrl = await createCheckout(12500); // Amount in cents (e.g., $125.00)
    console.log("Checkout URL:", checkoutUrl); // Log the checkout URL
  } catch (error) {
    console.error("Error creating Quick Pay link:", error);
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
  testCreateQuickPay,
};
