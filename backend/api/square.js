const { Client, Environment } = require("square");

const client = new Client({
  environment: Environment.Sandbox,
  accessToken:
    process.env.SQUARE_ACCESS_TOKEN ||
    "EAAAl0ONNhJnTUCSsseWYApCo1Vv-04R8M5LhfQMttLQIWSO4J90AitdjbZ-ll8R",
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

const testSquareApi = async () => {
  try {
    const items = await listItems();
    console.log("Square API is working. Items:", items);
  } catch (error) {
    console.error("Error testing Square API:", error);
  }
};

module.exports = { listItems, testSquareApi };
