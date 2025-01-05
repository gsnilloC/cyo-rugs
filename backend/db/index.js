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
