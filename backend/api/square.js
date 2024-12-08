const { Client, Environment } = require("square");
require("dotenv").config();

const client = new Client({
  environment: Environment.Production,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

const { getInventoryItemById } = require("../db/config");

const processedOrders = new Set();

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
          // Get inventory for specific variation
          const inventoryResponse =
            await client.inventoryApi.retrieveInventoryCount(item.variationId);

          const inventoryQuantity =
            inventoryResponse.result.counts &&
            inventoryResponse.result.counts.length > 0
              ? parseInt(inventoryResponse.result.counts[0].quantity, 10)
              : 0;

          if (inventoryQuantity < item.quantity) {
            throw new Error(
              `Not enough stock for ${item.name} (${item.selectedColor}). Available: ${inventoryQuantity}`
            );
          }

          const price = parseFloat(item.price);
          const quantity = parseInt(item.quantity, 10);

          if (isNaN(price) || isNaN(quantity)) {
            throw new Error(`Invalid price or quantity for ${item.name}`);
          }

          return {
            catalogObjectId: item.variationId, // Use variation ID instead of base item
            quantity: quantity.toString(),
            basePriceMoney: {
              amount: Math.round(price * 100),
              currency: "USD",
            },
            note: `Color: ${item.selectedColor} | ${
              item.description || "No description available"
            }`,
          };
        } catch (error) {
          console.error(`Error processing item ${item.name}:`, error.message);
          throw error; // Propagate error up
        }
      })
    );

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
        .map(async (item) => {
          try {
            if (!item.itemData) {
              console.warn(`Item with ID ${item.id} does not have itemData.`);
              return null;
            }

            const { name, description, variations, imageIds } = item.itemData;

            // Format variations with quantity and images
            const formattedVariations = await Promise.all(
              variations.map(async (variation) => {
                const priceMoney = variation.itemVariationData.priceMoney;
                const price = priceMoney ? Number(priceMoney.amount) / 100 : 0;

                // Fetch inventory count for the variation
                let quantity = 0;
                try {
                  const inventoryResponse =
                    await client.inventoryApi.retrieveInventoryCount(
                      variation.id
                    );
                  quantity =
                    inventoryResponse.result.counts &&
                    inventoryResponse.result.counts.length > 0
                      ? parseInt(
                          inventoryResponse.result.counts[0].quantity,
                          10
                        )
                      : 0;
                } catch (error) {
                  console.error(
                    `Error retrieving inventory for variation ${variation.id}:`,
                    error.message
                  );
                }

                // Retrieve image URLs for the variation
                const variationImageIds =
                  variation.itemVariationData.imageIds || [];
                const variationImageUrls =
                  variationImageIds.length > 0
                    ? await getImageUrls(variationImageIds)
                    : [];

                // Print variation image URLs to console
                console.log(
                  `Variation ID: ${variation.id}, Image URLs:`,
                  variationImageUrls
                );

                return {
                  v_id: variation.id,
                  v_name: variation.itemVariationData.name,
                  v_price: price,
                  v_quantity: quantity,
                };
              })
            );

            // Retrieve image URLs for the item
            const imageUrls =
              imageIds && imageIds.length > 0
                ? await getImageUrls(imageIds)
                : [];

            const itemData = {
              id: item.id,
              name: name || "No name available",
              description: description || "No description available",
              variations: formattedVariations,
              imageUrls: imageUrls,
            };

            // Print item data to console
            console.log("Retrieved Item:", itemData);

            return itemData;
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

async function decrementInventory(orderId) {
  const serializeBigInt = (obj) => {
    return JSON.parse(
      JSON.stringify(obj, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
  };

  try {
    // Check if order was already processed
    if (processedOrders.has(orderId)) {
      console.log(`Order ${orderId} was already processed, skipping...`);
      return;
    }

    console.log("Decrementing inventory for order ID:", orderId);
    processedOrders.add(orderId);

    const orderResponse = await client.ordersApi.retrieveOrder(orderId);
    const lineItems = orderResponse.result.order.lineItems;

    if (!lineItems || lineItems.length === 0) {
      throw new Error("No line items found in the order");
    }

    console.log("Line Items:", serializeBigInt(lineItems));

    const changes = await Promise.all(
      lineItems.map(async (item) => {
        console.log("\nProcessing item:", item);
        
        const variationId = item.catalogObjectId;
        if (!variationId) {
          console.warn(`No variation ID found for item: ${item.name}`);
          return null;
        }

        const inventoryResponse = await client.inventoryApi.retrieveInventoryCount(variationId);
        const currentQuantity = inventoryResponse.result.counts?.[0]?.quantity || "0";

        console.log(`Current inventory for variation ${variationId}: ${currentQuantity}`);

        return {
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
      })
    );

    const validChanges = changes.filter(Boolean);

    if (validChanges.length === 0) {
      throw new Error("No valid inventory adjustments found");
    }

    const response = await client.inventoryApi.batchChangeInventory({
      idempotencyKey: orderId, // Use orderId as idempotency key
      changes: validChanges,
    });

    console.log("Inventory adjustment response:", serializeBigInt(response.result));
    return response;
  } catch (error) {
    console.error("Error decrementing inventory:", error);
    if (error.result && error.result.errors) {
      console.error("Square API errors:", serializeBigInt(error.result.errors));
    }
    throw error;
  }
}

const getPricesForItemIds = async (itemIds) => {
  try {
    const response = await client.catalogApi.batchRetrieveCatalogObjects({
      objectIds: itemIds,
    });

    const items = response.result.objects;
    const prices = items.map((item) => {
      const variation = item.itemData.variations[0];
      const priceMoney = variation.itemVariationData.priceMoney;
      const price = priceMoney ? Number(priceMoney.amount) / 100 : 0;
      return {
        id: item.id,
        price,
      };
    });

    return prices;
  } catch (error) {
    console.error("Error fetching prices from Square:", error);
    throw error;
  }
};

module.exports = {
  listItems,
  testSquareApi,
  createCheckout,
  getInventoryCount,
  decrementInventory,
  getInventoryCounts,
  getPricesForItemIds,
};
