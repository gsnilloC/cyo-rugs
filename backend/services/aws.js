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
    const listParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Prefix: "homepage/",
    };

    const listedObjects = await s3.listObjectsV2(listParams);

    if (!listedObjects.Contents || !Array.isArray(listedObjects.Contents)) {
      console.error(
        "S3 response does not contain 'Contents' or it's not an array"
      );
      return [];
    }

    const imageUrls = listedObjects.Contents.map(({ Key }) => {
      return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${Key}`;
    });

    return imageUrls;
  } catch (error) {
    console.error("Error fetching homepage images:", error);
    throw error;
  }
};

const uploadHomepageImages = async (files) => {
  console.log("Uploading homepage images:", files);
  const imageUrls = [];
  let i = 1;

  for (const file of files) {
    const imageKey = `homepage/image${i}`;
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
      console.error("Error uploading homepage image: ", error);
      throw error;
    }
  }

  return imageUrls;
};

const deleteImagesInFolder = async (folder) => {
  try {
    const listParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Prefix: folder,
    };

    const listedObjects = await s3.listObjectsV2(listParams);

    if (
      !listedObjects.Contents ||
      !Array.isArray(listedObjects.Contents) ||
      listedObjects.Contents.length === 0
    )
      return;

    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Delete: { Objects: [] },
    };

    listedObjects.Contents.forEach(({ Key }) => {
      deleteParams.Delete.Objects.push({ Key });
    });

    await s3.deleteObjects(deleteParams);
  } catch (error) {
    console.error("Error deleting images in folder:", error);
    throw error;
  }
};

module.exports = {
  uploadImages,
  fetchHomepageImages,
  uploadHomepageImages,

  deleteImagesInFolder,
};
