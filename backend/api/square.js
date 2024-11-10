const { Client, Environment } = require("square");
require("dotenv").config();

const client = new Client({
  environment: Environment.Production,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

async function createCheckout(cartItems) {
  try {
    const lineItems = cartItems.map((item) => ({
      name: item.name,
      quantity: item.quantity.toString(),
      basePriceMoney: {
        amount: Math.round(item.price * 100),
        note: `Price: $${item.price.toFixed(2)} | Description: ${
          item.description || "No description available"
        }`,
      },
    }));

    for (const item of cartItems) {
      const itemDetails = await client.catalogApi.retrieveCatalogObject(
        item.id
      );
      const inventoryQuantity =
        itemDetails.result.object.itemData.inventoryQuantity || 0;

      if (inventoryQuantity < item.quantity) {
        throw new Error(`Not enough stock for ${item.name}.`);
      }
    }

    const orderRequest = {
      idempotency_key: Date.now().toString(),
      order: {
        locationId: process.env.SQUARE_LOCATION_ID,
        lineItems: lineItems,
      },
      checkoutOptions: {
        redirectUrl: "http://54.241.69.82/shop",
        shippingAddressCollection: {
          allowedCountries: ["US"],
        },
        customFields: [
          {
            title: "Please Enter Full Address",
            inputType: "TEXT",
            text: "Please enter your full shipping address.",
          },
        ],
      },
    };

    const response = await client.checkoutApi.createPaymentLink(orderRequest);

    const paymentLink = response.result.paymentLink;
    return paymentLink?.url || null;
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
}

module.exports = {
  createCheckout,
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
  try {
    const response = await client.catalogApi.listCatalog();
    const items = response.result.objects;

    return await Promise.all(
      items
        .filter((item) => item.type !== "CUSTOM_ATTRIBUTE_DEFINITION")
        .map(async (item) => {
          if (!item.itemData) {
            console.warn(`Item with ID ${item.id} does not have itemData.`);
            return null;
          }

          const { name, description, variations, imageIds } = item.itemData;

          let formattedPrice = 0;
          if (variations && variations.length > 0) {
            const priceMoney = variations[0].itemVariationData.priceMoney;
            if (priceMoney) {
              formattedPrice = Number(priceMoney.amount) / 100;
            }
          }

          const imageUrls =
            imageIds && imageIds.length > 0 ? await getImageUrls(imageIds) : [];

          return {
            id: item.id,
            name: name || "Unnamed Item",
            description: description || "No description available",
            price: formattedPrice,
            imageUrls: imageUrls,
          };
        })
    );
  } catch (error) {
    console.error("Error retrieving items:", error);
    throw error;
  }
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
    const response = await client.locationsApi.listLocations();
    const locations = response.result.locations;
    if (locations && locations.length > 0) {
      console.log("Square API is connected. Location ID(s):");
      locations.forEach((location) => {
        console.log("Location ID:", location.id);
        console.log("Location Name:", location.name);
        console.log("Address:", location.address);
      });
    } else {
      console.log("No locations found. Verify your account setup.");
    }
  } catch (error) {
    console.error("Error testing Square API:", error);
  }
};

module.exports = {
  listItems,
  getItemById,
  testSquareApi,
  createCheckout,
};
