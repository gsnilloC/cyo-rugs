const { pool, testConnection, listTables } = require("./config");

const {
  createInventoryTable,
  getInventoryItems,
  getInventoryItemById,
  deleteTable,
  handleInventoryUpdate,
  deleteZeroQuantityItems,
  deleteInventoryItemByName,
} = require("./inventoryTable");

const {
  createSettingsTable,
  updateRequestsStatus,
  getRequestsStatus,
} = require("./settingsTable");

const {
  createRequestsTable,
  createRequest,
  getRequests,
  updateRequestStatus,
  deleteRequestById,
} = require("./requestTable");

module.exports = {
  pool,
  testConnection,
  listTables,

  createSettingsTable,
  updateRequestsStatus,
  getRequestsStatus,

  createInventoryTable,
  getInventoryItems,
  getInventoryItemById,
  deleteTable,
  handleInventoryUpdate,
  deleteZeroQuantityItems,
  deleteInventoryItemByName,

  createRequestsTable,
  createRequest,
  getRequests,
  updateRequestStatus,
  deleteRequestById,
};
