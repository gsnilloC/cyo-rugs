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

const fetchHomepageImages = async () => {
  try {
    const response = await s3.listObjectsV2({
      Bucket: process.env.AWS_S3_BUCKET,
      Prefix: "homepage/",
    });
    const imageKeys = response.Contents.map((item) => item.Key);
    const imageUrls = imageKeys.map(
      (key) => `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`
    );
    return imageUrls;
  } catch (error) {
    console.error("Error fetching homepage images:", error);
    throw error;
  }
};

module.exports = {
  uploadImages,
  fetchHomepageImages,
};
