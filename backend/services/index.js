const {
  uploadImages,
  fetchHomepageImages,
  uploadHomepageImages,
  deleteImagesInFolder,
} = require("./aws");
const squareClient = require("./squareClient");
const {
  listItems,
  testSquareApi,
  createCheckout,
  getInventoryCount,
  decrementInventory,
  getInventoryCounts,
  getPricesForItemIds,
} = require("./square");
const verifyRecaptcha = require("./recaptcha");
const confirmationEmail = require("./email/confirmationEmail");
// const shippingEmail = require("./email/shippingEmail");

module.exports = {
  uploadImages,
  listItems,
  fetchHomepageImages,
  uploadHomepageImages,
  testSquareApi,
  createCheckout,
  getInventoryCount,
  decrementInventory,
  getInventoryCounts,
  getPricesForItemIds,
  verifyRecaptcha,
  deleteImagesInFolder,
  client: squareClient,
  confirmationEmail,
  // shippingEmail,
};
