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
        currency: "USD",
      },
      note: `Price: $${item.price.toFixed(2)} | Description: ${
        item.description || "No description available"
      }`,
    }));

    for (const item of cartItems) {
      const inventoryQuantity = await getInventoryCount(item.id);
      if (inventoryQuantity < item.quantity) {
        throw new Error(
          `Not enough stock for ${item.name}. Available: ${inventoryQuantity}`
        );
      }
    }

    const orderRequest = {
      idempotency_key: Date.now().toString(),
      order: {
        locationId: process.env.SQUARE_LOCATION_ID,
        lineItems: lineItems,
      },
      checkoutOptions: {
        redirectUrl: "https://www.cyorugs.com/shop",
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
    return response.result.paymentLink?.url || null;
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
}

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

    const validItems = await Promise.all(
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
            name: name || "No name available",
            description: description || "No description available",
            price: formattedPrice,
            imageUrls: imageUrls,
          };
        })
    );

    return validItems.filter(item => item !== null);
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

const getInventoryCount = async (itemId) => {
  try {
    const itemDetails = await client.catalogApi.retrieveCatalogObject(itemId);

    const variations = itemDetails.result.object.itemData.variations;
    if (!variations || variations.length === 0) {
      console.warn(`No variations found for item ${itemId}.`);
      return 0;
    }

    let totalInventory = 0;

    for (const variation of variations) {
      const variationId = variation.id;
      const inventoryResponse = await client.inventoryApi.retrieveInventoryCount(variationId);

      const quantity = inventoryResponse.result.counts && inventoryResponse.result.counts.length > 0
        ? inventoryResponse.result.counts[0].quantity
        : 0;

      totalInventory += parseInt(quantity, 10);
    }
    return totalInventory;
  } catch (error) {
    console.error("Error retrieving inventory count:", error);
    throw error;
  }
};

const decrementInventory = async (orderId) => {
  const serializeBigInt = (obj) => {
    return JSON.parse(
      JSON.stringify(obj, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
  };

  try {
    console.log("Decrementing inventory for order ID:", orderId);

    const orderResponse = await client.ordersApi.retrieveOrder(orderId);
    const lineItems = orderResponse.result.order.lineItems;

    if (!lineItems || lineItems.length === 0) {
      throw new Error("No line items found in the order");
    }

    console.log("Line Items:", serializeBigInt(lineItems));

    const changes = await Promise.all(
      lineItems.map(async (item) => {
        console.log("\nProcessing item:", item.name);

        const catalogResponse = await client.catalogApi.searchCatalogItems({
          textFilter: item.name,
          limit: 1,
        });

        const catalogItem = catalogResponse.result.items?.[0];
        if (!catalogItem) {
          console.warn(`Catalog item not found for: ${item.name}`);
          return null;
        }

        const variationId = catalogItem.itemData.variations[0]?.id;
        if (!variationId) {
          console.warn(`No variation found for item: ${item.name}`);
          return null;
        }

        const adjustment = {
          type: "ADJUSTMENT",
          adjustment: {
            catalogObjectId: variationId,
            fromState: "IN_STOCK",
            toState: "SOLD",
            quantity: item.quantity,
            locationId: process.env.SQUARE_LOCATION_ID,
            occurredAt: new Date().toISOString(),
          },
        };

        return adjustment;
      })
    );

    const validChanges = changes.filter(Boolean);

    if (validChanges.length === 0) {
      throw new Error("No valid inventory adjustments found");
    }

    const response = await client.inventoryApi.batchChangeInventory({
      idempotencyKey: Date.now().toString(),
      changes: validChanges,
    });

    console.log(
      "Inventory adjustment response:",
      serializeBigInt(response.result)
    );

    return response;
  } catch (error) {
    console.error("Error decrementing inventory:", error);
    if (error.result && error.result.errors) {
      console.error("Square API errors:", serializeBigInt(error.result.errors));
    }
    throw error;
  }
};

module.exports = {
  listItems,
  getItemById,
  testSquareApi,
  createCheckout,
  getInventoryCount,
  decrementInventory,
};
