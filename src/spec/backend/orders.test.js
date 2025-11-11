// Set up environment variables before any imports
process.env.SQUARE_ACCESS_TOKEN = 'test-square-token';
process.env.SQUARE_LOCATION_ID = 'test-location-id';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.AWS_ACCESS_KEY_ID = 'test-aws-key';
process.env.AWS_SECRET_ACCESS_KEY = 'test-aws-secret';
process.env.SENDGRID_API_KEY = 'test-sendgrid-key';
process.env.RECAPTCHA_SECRET_KEY = 'test-recaptcha-key';

const request = require('supertest');
const createTestApp = require('./testApp');
const db = require('../../../backend/db');

// Mock the database functions
jest.mock('../../../backend/db');

describe('Orders API - GET /api/orders', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  test('returns all custom requests successfully', async () => {
    const mockRequests = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-1234',
        size: '5x7',
        colors: 'Blue, White',
        design_notes: 'Modern geometric pattern',
        status: 'Received',
        created_at: '2025-11-01T00:00:00Z',
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '555-5678',
        size: '8x10',
        colors: 'Red, Gold',
        design_notes: 'Traditional floral',
        status: 'In Progress',
        created_at: '2025-11-02T00:00:00Z',
      },
    ];

    db.getRequests.mockResolvedValue(mockRequests);

    const response = await request(app).get('/api/orders');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(db.getRequests).toHaveBeenCalledTimes(1);
  });

  test('returns empty array when no requests', async () => {
    db.getRequests.mockResolvedValue([]);

    const response = await request(app).get('/api/orders');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('returns requests with all fields', async () => {
    const mockRequests = [
      {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        phone: '555-0000',
        size: '6x9',
        colors: 'Green',
        design_notes: 'Test design',
        status: 'Received',
        created_at: '2025-11-10T12:00:00Z',
        image_url: 'https://example.com/reference.jpg',
      },
    ];

    db.getRequests.mockResolvedValue(mockRequests);

    const response = await request(app).get('/api/orders');

    const request_data = response.body[0];
    expect(request_data).toHaveProperty('id');
    expect(request_data).toHaveProperty('name');
    expect(request_data).toHaveProperty('email');
    expect(request_data).toHaveProperty('phone');
    expect(request_data).toHaveProperty('size');
    expect(request_data).toHaveProperty('colors');
    expect(request_data).toHaveProperty('design_notes');
    expect(request_data).toHaveProperty('status');
    expect(request_data).toHaveProperty('created_at');
  });

  test('handles database error gracefully', async () => {
    db.getRequests.mockRejectedValue(new Error('Database connection failed'));

    const response = await request(app).get('/api/orders');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to retrieve orders' });
  });

  test('returns requests in order', async () => {
    const mockRequests = [
      { id: 1, name: 'First', email: 'first@test.com', status: 'Received', created_at: '2025-11-01T00:00:00Z' },
      { id: 2, name: 'Second', email: 'second@test.com', status: 'In Progress', created_at: '2025-11-02T00:00:00Z' },
      { id: 3, name: 'Third', email: 'third@test.com', status: 'Done', created_at: '2025-11-03T00:00:00Z' },
    ];

    db.getRequests.mockResolvedValue(mockRequests);

    const response = await request(app).get('/api/orders');

    expect(response.body[0].id).toBe(1);
    expect(response.body[1].id).toBe(2);
    expect(response.body[2].id).toBe(3);
  });
});

describe('Orders API - PATCH /api/orders/:id/status', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  test('updates request status successfully', async () => {
    const updatedRequest = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'In Progress',
      updated_at: '2025-11-10T12:00:00Z',
    };

    db.updateRequestStatus.mockResolvedValue(updatedRequest);

    const response = await request(app)
      .patch('/api/orders/1/status')
      .send({ status: 'In Progress' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('In Progress');
    expect(db.updateRequestStatus).toHaveBeenCalledWith('1', 'In Progress');
  });

  test('accepts "Received" status', async () => {
    const updatedRequest = { id: 1, status: 'Received' };
    db.updateRequestStatus.mockResolvedValue(updatedRequest);

    const response = await request(app)
      .patch('/api/orders/1/status')
      .send({ status: 'Received' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Received');
  });

  test('accepts "In Progress" status', async () => {
    const updatedRequest = { id: 1, status: 'In Progress' };
    db.updateRequestStatus.mockResolvedValue(updatedRequest);

    const response = await request(app)
      .patch('/api/orders/1/status')
      .send({ status: 'In Progress' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('In Progress');
  });

  test('accepts "Preparing for Shipping" status', async () => {
    const updatedRequest = { id: 1, status: 'Preparing for Shipping' };
    db.updateRequestStatus.mockResolvedValue(updatedRequest);

    const response = await request(app)
      .patch('/api/orders/1/status')
      .send({ status: 'Preparing for Shipping' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Preparing for Shipping');
  });

  test('accepts "Done" status', async () => {
    const updatedRequest = { id: 1, status: 'Done' };
    db.updateRequestStatus.mockResolvedValue(updatedRequest);

    const response = await request(app)
      .patch('/api/orders/1/status')
      .send({ status: 'Done' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Done');
  });

  test('rejects invalid status', async () => {
    const response = await request(app)
      .patch('/api/orders/1/status')
      .send({ status: 'Invalid Status' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid status' });
    expect(db.updateRequestStatus).not.toHaveBeenCalled();
  });

  test('rejects empty status', async () => {
    const response = await request(app)
      .patch('/api/orders/1/status')
      .send({ status: '' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid status' });
  });

  test('rejects missing status field', async () => {
    const response = await request(app)
      .patch('/api/orders/1/status')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid status' });
  });

  test('returns 404 when request not found', async () => {
    db.updateRequestStatus.mockResolvedValue(null);

    const response = await request(app)
      .patch('/api/orders/999/status')
      .send({ status: 'In Progress' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Request not found' });
  });

  test('handles database error gracefully', async () => {
    db.updateRequestStatus.mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .patch('/api/orders/1/status')
      .send({ status: 'In Progress' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to update request status' });
  });

  test('returns full updated request object', async () => {
    const updatedRequest = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-1234',
      size: '5x7',
      colors: 'Blue',
      design_notes: 'Test',
      status: 'In Progress',
      created_at: '2025-11-01T00:00:00Z',
      updated_at: '2025-11-10T12:00:00Z',
    };

    db.updateRequestStatus.mockResolvedValue(updatedRequest);

    const response = await request(app)
      .patch('/api/orders/1/status')
      .send({ status: 'In Progress' });

    expect(response.body).toEqual(updatedRequest);
  });
});

describe('Orders API - DELETE /api/orders/:id', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  test('deletes request successfully', async () => {
    db.deleteRequestById.mockResolvedValue({ rowCount: 1 });

    const response = await request(app).delete('/api/orders/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Request deleted successfully' });
    expect(db.deleteRequestById).toHaveBeenCalledWith('1');
  });

  test('returns 404 when request not found', async () => {
    db.deleteRequestById.mockResolvedValue({ rowCount: 0 });

    const response = await request(app).delete('/api/orders/999');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Request not found' });
  });

  test('handles database error gracefully', async () => {
    db.deleteRequestById.mockRejectedValue(new Error('Database error'));

    const response = await request(app).delete('/api/orders/1');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to delete request' });
  });

  test('accepts numeric ID', async () => {
    db.deleteRequestById.mockResolvedValue({ rowCount: 1 });

    const response = await request(app).delete('/api/orders/123');

    expect(response.status).toBe(200);
    expect(db.deleteRequestById).toHaveBeenCalledWith('123');
  });

  test('calls database function only once', async () => {
    db.deleteRequestById.mockResolvedValue({ rowCount: 1 });

    await request(app).delete('/api/orders/1');

    expect(db.deleteRequestById).toHaveBeenCalledTimes(1);
  });
});

describe('Orders API - Status Workflow', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  test('can progress through all statuses', async () => {
    const statuses = ['Received', 'In Progress', 'Preparing for Shipping', 'Done'];

    for (const status of statuses) {
      const updatedRequest = { id: 1, status };
      db.updateRequestStatus.mockResolvedValue(updatedRequest);

      const response = await request(app)
        .patch('/api/orders/1/status')
        .send({ status });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(status);
    }
  });

  test('can update status multiple times', async () => {
    // First update
    db.updateRequestStatus.mockResolvedValue({ id: 1, status: 'In Progress' });
    const response1 = await request(app)
      .patch('/api/orders/1/status')
      .send({ status: 'In Progress' });
    expect(response1.body.status).toBe('In Progress');

    // Second update
    db.updateRequestStatus.mockResolvedValue({ id: 1, status: 'Done' });
    const response2 = await request(app)
      .patch('/api/orders/1/status')
      .send({ status: 'Done' });
    expect(response2.body.status).toBe('Done');
  });
});

describe('Orders API - Integration Tests', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  test('can fetch, update, and delete a request', async () => {
    const mockRequests = [
      { id: 1, name: 'Test', status: 'Received' },
    ];

    // Fetch all requests
    db.getRequests.mockResolvedValue(mockRequests);
    const fetchResponse = await request(app).get('/api/orders');
    expect(fetchResponse.body).toHaveLength(1);

    // Update status
    db.updateRequestStatus.mockResolvedValue({ id: 1, status: 'In Progress' });
    const updateResponse = await request(app)
      .patch('/api/orders/1/status')
      .send({ status: 'In Progress' });
    expect(updateResponse.body.status).toBe('In Progress');

    // Delete request
    db.deleteRequestById.mockResolvedValue({ rowCount: 1 });
    const deleteResponse = await request(app).delete('/api/orders/1');
    expect(deleteResponse.body.message).toBe('Request deleted successfully');
  });

  test('maintains data consistency across operations', async () => {
    const requestData = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'Received',
    };

    // Get request
    db.getRequests.mockResolvedValue([requestData]);
    const getResponse = await request(app).get('/api/orders');
    expect(getResponse.body[0].name).toBe('John Doe');

    // Update maintains other fields
    const updatedData = { ...requestData, status: 'In Progress' };
    db.updateRequestStatus.mockResolvedValue(updatedData);
    const updateResponse = await request(app)
      .patch('/api/orders/1/status')
      .send({ status: 'In Progress' });
    expect(updateResponse.body.name).toBe('John Doe');
    expect(updateResponse.body.email).toBe('john@example.com');
  });
});

