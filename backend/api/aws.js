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
        const customerName = orderKey.split("/")[1].split("-")[0];
        const uniqueIdentifier = orderKey
          .split("/")[1]
          .split("-")
          .slice(1, 2)
          .join("-");

        const orderData = await s3.getObject({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: orderKey,
        });

        const orderContent = await streamToString(orderData.Body);
        const orderMetadata = JSON.parse(orderContent);

        const imageUrls = [];
        for (let i = 1; i <= 3; i++) {
          const imageKey = `orders/${customerName}-${uniqueIdentifier}-image${i}`;
          imageUrls.push(
            `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageKey}`
          );
        }

        return { ...orderMetadata, imageUrls };
      })
    );

    return orderDetails;
  } catch (error) {
    console.error("Error listing orders: ", error);
    throw error;
  }
};

const streamToString = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    stream.on("error", reject);
  });
};

const displayOrders = async () => {
  try {
    const orders = await listOrders();
    orders.forEach((order) => {
      console.log(`Name: ${order.name}`);
      console.log(`Phone: ${order.phone}`);
      console.log(`Email: ${order.email}`);
      console.log(`Description: ${order.description}`);
      console.log(`Image URLs: ${order.imageUrls.join(", ")}`);
      console.log("-------------------------");
    });
  } catch (error) {
    console.error("Error displaying orders: ", error);
  }
};

module.exports = {
  uploadImages,
  uploadMetadata,
  listOrders,
  displayOrders,
};
