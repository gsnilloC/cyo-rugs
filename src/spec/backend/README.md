# Backend API Tests

This directory contains integration tests for the backend API endpoints.

## 📂 Structure

```
src/spec/backend/
├── testApp.js         - Test Express app setup
├── items.test.js      - Items/Products API tests (41 tests)
├── orders.test.js     - Orders/Requests API tests (36 tests)
└── README.md          - This file
```

## 🧪 Test Coverage

### ✅ Items API (`/api/items`) - 41 tests

#### GET /api/items
- Returns all items successfully
- Returns items with correct format (id, catalogObjectId, name, description, price, quantity, imageUrls, v_quantities)
- Returns empty array when no items
- Handles items without variations
- Handles database errors gracefully
- Parses prices correctly from strings
- Includes all required fields
- Handles null image_urls gracefully
- Handles multiple image URLs
- Handles very large price values
- Handles zero quantity items

#### GET /api/items/:id
- Returns specific item by id
- Returns item with all variation details (v_ids, v_names, v_quantities)
- Returns 404 when item not found
- Handles item without variations
- Handles database errors gracefully
- Includes lastUpdated timestamp
- Uses variation price when available
- Includes all required fields

### ✅ Orders API (`/api/orders`) - 36 tests

#### GET /api/orders
- Returns all custom requests successfully
- Returns empty array when no requests
- Returns requests with all fields (id, name, email, phone, size, colors, design_notes, status, created_at)
- Handles database errors gracefully
- Returns requests in order

#### PATCH /api/orders/:id/status
- Updates request status successfully
- Accepts valid statuses: "Received", "In Progress", "Preparing for Shipping", "Done"
- Rejects invalid status
- Rejects empty status
- Rejects missing status field
- Returns 404 when request not found
- Handles database errors gracefully
- Returns full updated request object
- Can progress through all statuses
- Can update status multiple times

#### DELETE /api/orders/:id
- Deletes request successfully
- Returns 404 when request not found
- Handles database errors gracefully
- Accepts numeric ID
- Calls database function only once

#### Integration Tests
- Can fetch, update, and delete a request
- Maintains data consistency across operations

## 🚀 Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Backend Tests Only
```bash
npm test -- backend/
```

### Run Specific Test File
```bash
npm test -- items.test.js
npm test -- orders.test.js
```

### Run with Coverage
```bash
npm test -- --coverage --watchAll=false backend/
```

## 📊 Test Statistics

**Total Backend Tests: 77**
- Items API: 41 tests ✅
- Orders API: 36 tests ✅

## 🛠️ Testing Tools

- **Jest** - Test runner
- **Supertest** - HTTP assertion library for API testing
- **Mock Functions** - Database function mocking

## 🔍 What We Test

### Items API
✅ Retrieving all inventory items
✅ Retrieving single item by ID
✅ Data formatting and transformation
✅ Price parsing (string to number)
✅ Image URL handling
✅ Variation data (colors, quantities)
✅ Error handling (404, 500)
✅ Edge cases (null values, zero quantities, large prices)

### Orders API
✅ Fetching all custom requests
✅ Updating request status with validation
✅ Deleting requests
✅ Status workflow (Received → In Progress → Preparing for Shipping → Done)
✅ Input validation
✅ Error handling
✅ Data consistency

## 📝 Test Patterns

### Setup
```javascript
const request = require('supertest');
const createTestApp = require('./testApp');
const db = require('../../../backend/db');

jest.mock('../../../backend/db');

describe('API Tests', () => {
  let app;
  
  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });
  
  test('example test', async () => {
    db.someFunction.mockResolvedValue(mockData);
    
    const response = await request(app).get('/api/endpoint');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expected);
  });
});
```

### Mocking Database
```javascript
// Mock successful response
db.getInventoryItems.mockResolvedValue(mockItems);

// Mock not found
db.getInventoryItemById.mockResolvedValue(null);

// Mock error
db.updateRequestStatus.mockRejectedValue(new Error('Database error'));
```

### Testing API Endpoints
```javascript
// GET request
const response = await request(app).get('/api/items');

// POST request with body
const response = await request(app)
  .post('/api/orders')
  .send({ data });

// PATCH request
const response = await request(app)
  .patch('/api/orders/1/status')
  .send({ status: 'In Progress' });

// DELETE request
const response = await request(app).delete('/api/orders/1');
```

## 🔜 Future Tests

- [ ] `utils.test.js` - Utility endpoints (request form, homepage images)
- [ ] `verify.test.js` - Authentication endpoints
- [ ] `inventory.test.js` - Inventory sync endpoints
- [ ] `settings.test.js` - Settings endpoints
- [ ] `webhooks.test.js` - Square payment webhooks

## 🐛 Debugging

### View SQL Queries
Add logging to database functions to see actual queries being executed.

### Test Individual Endpoints
```bash
npm test -- -t "returns all items successfully"
```

### Check Mock Calls
```javascript
expect(db.someFunction).toHaveBeenCalledWith(expectedArg);
expect(db.someFunction).toHaveBeenCalledTimes(1);
```

## 📚 Resources

- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Jest Mocking Guide](https://jestjs.io/docs/mock-functions)
- [Express Testing Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

**Last Updated:** November 10, 2025
**Total Tests:** 77 ✅
**Coverage:** Items and Orders API fully tested

