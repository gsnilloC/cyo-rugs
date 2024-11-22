const { Client, Environment } = require("square");
require("dotenv").config();

const client = new Client({
  environment: Environment.Production,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

const { getInventoryItemById } = require("../db/config");

const getInventoryCount = async (itemId) => {
  try {
    const item = await getInventoryItemById(itemId);
    if (!item) {
      console.warn(`No inventory found for item ${itemId}`);
      return 0;
    }
    return item.quantity;
  } catch (error) {
    console.error("Error retrieving inventory count from database:", error);
    return 0;
  }
};

async function createCheckout(cartItems) {
  try {
    const lineItems = await Promise.all(
      cartItems.map(async (item) => {
        try {
          const inventoryQuantity = await getInventoryCount(item.id);
          if (inventoryQuantity < item.quantity) {
            throw new Error(
              `Not enough stock for ${item.name}. Available: ${inventoryQuantity}`
            );
          }

          return {
            name: item.name,
            quantity: item.quantity.toString(),
            basePriceMoney: {
              amount: Math.round(item.price * 100),
              currency: "USD",
            },
            note: `Price: $${item.price.toFixed(2)} | Description: ${
              item.description || "No description available"
            }`,
          };
        } catch (error) {
          console.error(`Error processing item ${item.name}:`, error.message);
          return null;
        }
      })
    );

    const validLineItems = lineItems.filter((item) => item !== null);

    const orderRequest = {
      idempotency_key: Date.now().toString(),
      order: {
        locationId: process.env.SQUARE_LOCATION_ID,
        lineItems: validLineItems,
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

const getInventoryCounts = async (itemId) => {
  try {
    const itemDetails = await client.catalogApi.retrieveCatalogObject(itemId);
    const variations = itemDetails.result.object.itemData.variations;

    if (!variations || variations.length === 0) {
      console.warn(`No variations found for item ${itemId}.`);
      return 0;
    }

    let totalInventory = 0;

    for (const variation of variations) {
      try {
        const variationId = variation.id;
        const inventoryResponse =
          await client.inventoryApi.retrieveInventoryCount(variationId);
        const quantity =
          inventoryResponse.result.counts &&
          inventoryResponse.result.counts.length > 0
            ? inventoryResponse.result.counts[0].quantity
            : 0;

        totalInventory += parseInt(quantity, 10);
      } catch (error) {
        console.error(
          `Error retrieving inventory for variation ${variation.id}:`,
          error.message
        );
      }
    }
    return totalInventory;
  } catch (error) {
    console.error("Error retrieving inventory count:", error);
    return 0;
  }
};

const listItems = async () => {
  try {
    const response = await client.catalogApi.listCatalog();
    const items = response.result.objects;

    const validItems = await Promise.all(
      items
        .filter((item) => item.type !== "CUSTOM_ATTRIBUTE_DEFINITION")
        .filter(
          (item) =>
            item.id !== "XGPSDFAI4HGP5Q7EL2SKETHN" &&
            item.id !== "QPMG56NM75BMOG3QQXECF3BA"
        )
        .map(async (item) => {
          try {
            if (!item.itemData) {
              console.warn(`Item with ID ${item.id} does not have itemData.`);
              return null;
            }

            const { name, description, variations, imageIds } = item.itemData;

            // Get the catalog_object_id from the first variation
            const catalogObjectId = variations?.[0]?.id || null;

            let formattedPrice = 0;
            if (variations && variations.length > 0) {
              const priceMoney = variations[0].itemVariationData.priceMoney;
              if (priceMoney) {
                formattedPrice = Number(priceMoney.amount) / 100;
              }
            }

            const imageUrls =
              imageIds && imageIds.length > 0
                ? await getImageUrls(imageIds)
                : [];

            return {
              id: item.id,
              catalog_object_id: catalogObjectId,
              name: name || "No name available",
              description: description || "No description available",
              price: formattedPrice,
              imageUrls: imageUrls,
            };
          } catch (error) {
            console.error("Error processing item:", error.message);
            return null;
          }
        })
    );

    return validItems.filter((item) => item !== null);
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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// const getInventoryCount = async (itemId) => {
//   try {
//     await delay(100);
//     const itemDetails = await client.catalogApi.retrieveCatalogObject(itemId);
//     const variations = itemDetails.result.object.itemData.variations;

//     if (!variations || variations.length === 0) {
//       console.warn(`No variations found for item ${itemId}.`);
//       return 0;
//     }

//     let totalInventory = 0;

//     for (const variation of variations) {
//       try {
//         const variationId = variation.id;
//         await delay(500);
//         const inventoryResponse =
//           await client.inventoryApi.retrieveInventoryCount(variationId);
//         const quantity =
//           inventoryResponse.result.counts &&
//           inventoryResponse.result.counts.length > 0
//             ? inventoryResponse.result.counts[0].quantity
//             : 0;

//         totalInventory += parseInt(quantity, 10);
//       } catch (error) {
//         if (error.statusCode === 429) {
//           console.log(429);
//           return 0;
//         }
//         console.error(
//           `Error retrieving inventory for variation ${variation.id}:`,
//           error.message
//         );
//       }
//     }
//     return totalInventory;
//   } catch (error) {
//     if (error.statusCode === 429) {
//       console.log(429);
//       return 0;
//     }
//     console.error("Error retrieving inventory count:", error);
//     return 0;
//   }
// };

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
  getInventoryCounts,
};
