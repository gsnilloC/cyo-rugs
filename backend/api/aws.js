const { S3 } = require("@aws-sdk/client-s3");
const { fromEnv } = require("@aws-sdk/credential-provider-env");
require("dotenv").config();

const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

const uploadImage = async (file) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `uploads/${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    await s3.putObject(params);
    return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${params.Key}`;
  } catch (error) {
    console.error("Error uploading image: ", error);
    throw error;
  }
};

module.exports = { uploadImage };
