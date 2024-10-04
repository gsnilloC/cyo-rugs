const { Client, Environment } = require("square");

const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

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

module.exports = { listItems, getItemById, testSquareApi };
