// Set up environment variables before any imports
process.env.SQUARE_ACCESS_TOKEN = 'test-square-token';
process.env.SQUARE_LOCATION_ID = 'test-location-id';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.AWS_ACCESS_KEY_ID = 'test-aws-key';
process.env.AWS_SECRET_ACCESS_KEY = 'test-aws-secret';
process.env.SENDGRID_API_KEY = 'SG-test-sendgrid-key';
process.env.RECAPTCHA_SECRET_KEY = 'test-recaptcha-key';

const request = require('supertest');
const createTestApp = require('./testApp');
const db = require('../../../backend/db');

// Mock the database functions
jest.mock('../../../backend/db');

describe('Items API - GET /api/items', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  test('returns all items successfully', async () => {
    const mockItems = [
      {
        item_id: 'item1',
        catalog_object_id: 'cat1',
        name: 'Beautiful Rug 1',
        description: 'Hand-tufted, wool',
        price: '299.99',
        quantity: 5,
        image_urls: ['https://example.com/image1.jpg'],
        v_quantities: [5],
        variations: [{ price: '299.99' }],
      },
      {
        item_id: 'item2',
        catalog_object_id: 'cat2',
        name: 'Beautiful Rug 2',
        description: 'Hand-woven, silk',
        price: '499.99',
        quantity: 3,
        image_urls: ['https://example.com/image2.jpg'],
        v_quantities: [3],
        variations: [{ price: '499.99' }],
      },
    ];

    db.getInventoryItems.mockResolvedValue(mockItems);

    const response = await request(app).get('/api/items');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(db.getInventoryItems).toHaveBeenCalledTimes(1);
  });

  test('returns items with correct format', async () => {
    const mockItems = [
      {
        item_id: 'item1',
        catalog_object_id: 'cat1',
        name: 'Test Rug',
        description: 'Test description',
        price: '100.00',
        quantity: 10,
        image_urls: ['https://example.com/image.jpg'],
        v_quantities: [10],
        variations: [{ price: '100.00' }],
      },
    ];

    db.getInventoryItems.mockResolvedValue(mockItems);

    const response = await request(app).get('/api/items');

    expect(response.body[0]).toEqual({
      id: 'item1',
      catalogObjectId: 'cat1',
      name: 'Test Rug',
      description: 'Test description',
      price: 100.00,
      quantity: 10,
      imageUrls: ['https://example.com/image.jpg'],
      v_quantities: [10],
    });
  });

  test('returns empty array when no items', async () => {
    db.getInventoryItems.mockResolvedValue([]);

    const response = await request(app).get('/api/items');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('handles items without variations', async () => {
    const mockItems = [
      {
        item_id: 'item1',
        catalog_object_id: 'cat1',
        name: 'Test Rug',
        description: 'Test description',
        price: '150.00',
        quantity: 5,
        image_urls: [],
        v_quantities: [],
        variations: [],
      },
    ];

    db.getInventoryItems.mockResolvedValue(mockItems);

    const response = await request(app).get('/api/items');

    expect(response.body[0].price).toBe(150.00);
    expect(response.body[0].imageUrls).toEqual([]);
  });

  test('handles database error gracefully', async () => {
    db.getInventoryItems.mockRejectedValue(new Error('Database connection failed'));

    const response = await request(app).get('/api/items');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to retrieve items' });
  });

  test('parses prices correctly from strings', async () => {
    const mockItems = [
      {
        item_id: 'item1',
        catalog_object_id: 'cat1',
        name: 'Test Rug',
        description: 'Test',
        price: '99.50',
        quantity: 1,
        image_urls: [],
        v_quantities: [],
        variations: [{ price: '99.50' }],
      },
    ];

    db.getInventoryItems.mockResolvedValue(mockItems);

    const response = await request(app).get('/api/items');

    expect(typeof response.body[0].price).toBe('number');
    expect(response.body[0].price).toBe(99.50);
  });

  test('includes all required fields', async () => {
    const mockItems = [
      {
        item_id: 'item1',
        catalog_object_id: 'cat1',
        name: 'Test Rug',
        description: 'Test',
        price: '100.00',
        quantity: 5,
        image_urls: ['image1.jpg'],
        v_quantities: [5],
        variations: [{ price: '100.00' }],
      },
    ];

    db.getInventoryItems.mockResolvedValue(mockItems);

    const response = await request(app).get('/api/items');

    const item = response.body[0];
    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('catalogObjectId');
    expect(item).toHaveProperty('name');
    expect(item).toHaveProperty('description');
    expect(item).toHaveProperty('price');
    expect(item).toHaveProperty('quantity');
    expect(item).toHaveProperty('imageUrls');
    expect(item).toHaveProperty('v_quantities');
  });
});

describe('Items API - GET /api/items/:id', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  test('returns specific item by id', async () => {
    const mockItem = {
      item_id: 'item123',
      name: 'Specific Rug',
      description: 'Beautiful hand-tufted rug',
      price: '299.99',
      image_urls: ['https://example.com/rug.jpg'],
      quantity: 5,
      v_ids: ['v1', 'v2'],
      v_names: ['Blue', 'Red'],
      v_quantities: [3, 2],
      variations: [{ price: '299.99' }],
      last_updated: '2025-11-10T00:00:00Z',
    };

    db.getInventoryItemById.mockResolvedValue(mockItem);

    const response = await request(app).get('/api/items/item123');

    expect(response.status).toBe(200);
    expect(response.body.id).toBe('item123');
    expect(response.body.name).toBe('Specific Rug');
    expect(db.getInventoryItemById).toHaveBeenCalledWith('item123');
  });

  test('returns item with all variation details', async () => {
    const mockItem = {
      item_id: 'item123',
      name: 'Multi-Color Rug',
      description: 'Available in multiple colors',
      price: '199.99',
      image_urls: ['img1.jpg', 'img2.jpg'],
      quantity: 10,
      v_ids: ['var1', 'var2', 'var3'],
      v_names: ['Blue', 'Red', 'Green'],
      v_quantities: [4, 3, 3],
      variations: [{ price: '199.99' }],
      last_updated: '2025-11-10T00:00:00Z',
    };

    db.getInventoryItemById.mockResolvedValue(mockItem);

    const response = await request(app).get('/api/items/item123');

    expect(response.body.v_ids).toEqual(['var1', 'var2', 'var3']);
    expect(response.body.v_names).toEqual(['Blue', 'Red', 'Green']);
    expect(response.body.v_quantities).toEqual([4, 3, 3]);
  });

  test('returns 404 when item not found', async () => {
    db.getInventoryItemById.mockResolvedValue(null);

    const response = await request(app).get('/api/items/nonexistent');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Item not found' });
  });

  test('handles item without variations', async () => {
    const mockItem = {
      item_id: 'item123',
      name: 'Simple Rug',
      description: 'One of a kind',
      price: '150.00',
      image_urls: ['img.jpg'],
      quantity: 1,
      v_ids: [],
      v_names: [],
      v_quantities: [],
      variations: [],
      last_updated: '2025-11-10T00:00:00Z',
    };

    db.getInventoryItemById.mockResolvedValue(mockItem);

    const response = await request(app).get('/api/items/item123');

    expect(response.status).toBe(200);
    expect(response.body.v_ids).toEqual([]);
    expect(response.body.v_names).toEqual([]);
    expect(response.body.v_quantities).toEqual([]);
    expect(response.body.price).toBe(150.00);
  });

  test('handles database error gracefully', async () => {
    db.getInventoryItemById.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/api/items/item123');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to retrieve item' });
  });

  test('includes lastUpdated timestamp', async () => {
    const mockItem = {
      item_id: 'item123',
      name: 'Test Rug',
      description: 'Test',
      price: '100.00',
      image_urls: [],
      quantity: 5,
      v_ids: [],
      v_names: [],
      v_quantities: [],
      variations: [{ price: '100.00' }],
      last_updated: '2025-11-10T12:00:00Z',
    };

    db.getInventoryItemById.mockResolvedValue(mockItem);

    const response = await request(app).get('/api/items/item123');

    expect(response.body.lastUpdated).toBe('2025-11-10T12:00:00Z');
  });

  test('uses variation price when available', async () => {
    const mockItem = {
      item_id: 'item123',
      name: 'Test Rug',
      description: 'Test',
      price: '50.00',
      image_urls: [],
      quantity: 5,
      v_ids: ['v1'],
      v_names: ['Blue'],
      v_quantities: [5],
      variations: [{ price: '299.99' }],
      last_updated: '2025-11-10T00:00:00Z',
    };

    db.getInventoryItemById.mockResolvedValue(mockItem);

    const response = await request(app).get('/api/items/item123');

    // Should use variation price, not base price
    expect(response.body.price).toBe(299.99);
  });

  test('includes all required fields for single item', async () => {
    const mockItem = {
      item_id: 'item123',
      name: 'Test Rug',
      description: 'Test',
      price: '100.00',
      image_urls: ['img.jpg'],
      quantity: 5,
      v_ids: ['v1'],
      v_names: ['Blue'],
      v_quantities: [5],
      variations: [{ price: '100.00' }],
      last_updated: '2025-11-10T00:00:00Z',
    };

    db.getInventoryItemById.mockResolvedValue(mockItem);

    const response = await request(app).get('/api/items/item123');

    const item = response.body;
    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('name');
    expect(item).toHaveProperty('description');
    expect(item).toHaveProperty('price');
    expect(item).toHaveProperty('imageUrls');
    expect(item).toHaveProperty('quantity');
    expect(item).toHaveProperty('v_ids');
    expect(item).toHaveProperty('v_names');
    expect(item).toHaveProperty('v_quantities');
    expect(item).toHaveProperty('lastUpdated');
  });
});

describe('Items API - Edge Cases', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  test('handles null image_urls gracefully', async () => {
    const mockItems = [
      {
        item_id: 'item1',
        catalog_object_id: 'cat1',
        name: 'Test Rug',
        description: 'Test',
        price: '100.00',
        quantity: 5,
        image_urls: null,
        v_quantities: null,
        variations: [{ price: '100.00' }],
      },
    ];

    db.getInventoryItems.mockResolvedValue(mockItems);

    const response = await request(app).get('/api/items');

    expect(response.status).toBe(200);
    expect(response.body[0].imageUrls).toEqual([]);
    expect(response.body[0].v_quantities).toEqual([]);
  });

  test('handles multiple image URLs', async () => {
    const mockItem = {
      item_id: 'item123',
      name: 'Test Rug',
      description: 'Test',
      price: '100.00',
      image_urls: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg'],
      quantity: 5,
      v_ids: [],
      v_names: [],
      v_quantities: [],
      variations: [{ price: '100.00' }],
      last_updated: '2025-11-10T00:00:00Z',
    };

    db.getInventoryItemById.mockResolvedValue(mockItem);

    const response = await request(app).get('/api/items/item123');

    expect(response.body.imageUrls).toHaveLength(4);
    expect(response.body.imageUrls[0]).toBe('img1.jpg');
  });

  test('handles very large price values', async () => {
    const mockItems = [
      {
        item_id: 'item1',
        catalog_object_id: 'cat1',
        name: 'Expensive Rug',
        description: 'Very expensive',
        price: '99999.99',
        quantity: 1,
        image_urls: [],
        v_quantities: [],
        variations: [{ price: '99999.99' }],
      },
    ];

    db.getInventoryItems.mockResolvedValue(mockItems);

    const response = await request(app).get('/api/items');

    expect(response.body[0].price).toBe(99999.99);
  });

  test('handles zero quantity items', async () => {
    const mockItems = [
      {
        item_id: 'item1',
        catalog_object_id: 'cat1',
        name: 'Sold Out Rug',
        description: 'Out of stock',
        price: '100.00',
        quantity: 0,
        image_urls: [],
        v_quantities: [0],
        variations: [{ price: '100.00' }],
      },
    ];

    db.getInventoryItems.mockResolvedValue(mockItems);

    const response = await request(app).get('/api/items');

    expect(response.status).toBe(200);
    expect(response.body[0].quantity).toBe(0);
    expect(response.body[0].v_quantities).toEqual([0]);
  });
});

