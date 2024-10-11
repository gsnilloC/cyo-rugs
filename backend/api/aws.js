const { S3 } = require("@aws-sdk/client-s3");
const { fromEnv } = require("@aws-sdk/credential-provider-env");
require("dotenv").config();

const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

const uploadImages = async (files, customerData, uniqueIdentifier) => {
  const sanitizedCustomerName = customerData.name.replace(/\s+/g, "_");
  const imageUrls = [];
  var i = 1;

  for (const file of files) {
    const imageKey = `orders/${sanitizedCustomerName}-${uniqueIdentifier}-image${i}`;
    i++;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: imageKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      await s3.putObject(params);
      imageUrls.push(
        `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${imageKey}`
      );
    } catch (error) {
      console.error("Error uploading image: ", error);
      throw error;
    }
  }

  return imageUrls;
};

const uploadMetadata = async (customerData, uniqueIdentifier) => {
  const sanitizedCustomerName = customerData.name.replace(/\s+/g, "_");
  const metadataKey = `orders/${sanitizedCustomerName}-${uniqueIdentifier}-requestDetails.json`;

  const metadataParams = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: metadataKey,
    Body: JSON.stringify(customerData),
    ContentType: "application/json",
  };

  try {
    await s3.putObject(metadataParams);
  } catch (error) {
    console.error("Error uploading metadata: ", error);
    throw error;
  }
};

const listOrders = async () => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Prefix: "orders/",
    };

    const data = await s3.listObjectsV2(params);
    const orders = data.Contents.filter((item) =>
      item.Key.endsWith("-requestDetails.json")
    );

    const orderDetails = await Promise.all(
      orders.map(async (order) => {
        const orderKey = order.Key;
        const timestamp = orderKey.split("/")[1].split("-")[1]; // Extract the timestamp to match with image
        const customerName = orderKey.split("/")[1].split("-")[0]; // Extract customer name

        // Get the metadata
        const orderData = await s3.getObject({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: orderKey,
        });

        const orderContent = orderData.Body.toString("utf-8");
        const orderMetadata = JSON.parse(orderContent);

        // Get the corresponding image
        const imageKey = `orders/${customerName}-${timestamp}-${orderMetadata.imageFileName}`; // Get image file name dynamically if stored in metadata
        const imageUrl = `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${imageKey}`;

        return { ...orderMetadata, imageUrl }; // Return the metadata and image URL
      })
    );

    return orderDetails;
  } catch (error) {
    console.error("Error listing orders: ", error);
    throw error;
  }
};

const displayOrders = async () => {
  try {
    const orders = await listOrders();
    orders.forEach((order) => {
      console.log(`Name: ${order.name}`);
      console.log(`Phone: ${order.phone}`);
      console.log(`Email: ${order.email}`);
      console.log(`Description: ${order.description}`);
      console.log(`Image URL: ${order.imageUrl}`);
      console.log("-------------------------");
    });
  } catch (error) {
    console.error("Error displaying orders: ", error);
  }
};

module.exports = { uploadImages, uploadMetadata, listOrders, displayOrders };
