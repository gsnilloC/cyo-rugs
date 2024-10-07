const { Client, Environment } = require("square");

const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

  accessToken:
    process.env.SQUARE_ACCESS_TOKEN ||
    "EAAAl0ONNhJnTUCSsseWYApCo1Vv-04R8M5LhfQMttLQIWSO4J90AitdjbZ-ll8R",
});

// Function to get image URLs by image ID
const getImageUrls = async (imageIds) => {
  const imageUrls = await Promise.all(
    imageIds.map(async (imageId) => {
      const imageResponse = await client.catalogApi.retrieveCatalogObject(
        imageId
      );
      return imageResponse.result.object.imageData.url; // This will return the image URL
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

  // Map the items to include only the necessary fields
  return await Promise.all(
    items.map(async (item) => {
      // Get price (assuming you're looking at the first variation)
      const priceBigInt =
        item.itemData.variations[0].itemVariationData.priceMoney.amount;
      const formattedPrice = Number(priceBigInt) / 100; // Convert BigInt to Number and from cents to dollars

      // Get image URLs
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
        price: formattedPrice, // Price in dollars
        imageUrls: imageUrls, // Array of image URLs
      };
    })
  );
};

const testSquareApi = async () => {
  try {
    const items = await listItems();
    console.log("Square API is working. Items:", items);
  } catch (error) {
    console.error("Error testing Square API:", error);
  }
};

module.exports = { listItems, getItemById, testSquareApi };
