const request = require('supertest');
const express = require('express');
const jwt     = require('jsonwebtoken');

process.env.JWT_SECRET = 'test-secret';

// Mock Item model 
jest.mock('../../models/Item');
const Item = require('../../models/Item');

// Build app
const app = express();
app.use(express.json());
app.use('/api/tempItems', require('./items'));

// Valid token for a fake user, reused across all tests
const USER_ID    = 'user111';
const validToken = jwt.sign({ userId: USER_ID }, 'test-secret');
const authHeader = { Authorization: `Bearer ${validToken}` };

// Fake items that look like what Mongoose would return
const fakeItems = [
    { id: 'i1', name: 'Eggs',   quantity: 12, unit: 'Unit', userId: USER_ID },
    { id: 'i2', name: 'Butter', quantity: 2,  unit: 'tbsp', userId: USER_ID },
];

beforeEach(() => jest.clearAllMocks());


// Auth guard

describe('auth guard on items routes', () =>
{
    test('returns 401 when no token is provided', async () =>
    {
        const res = await request(app).get('/api/tempItems');
        expect(res.status).toBe(401);
    });
});


// GET /

describe('GET /api/tempItems', () =>
{
    test('returns all items for the logged-in user', async () =>
    {
        Item.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(fakeItems) });

        const res = await request(app)
            .get('/api/tempItems')
            .set(authHeader);

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0].name).toBe('Eggs');
    });

    test('returns 500 on database error', async () =>
    {
        Item.find.mockReturnValue({ sort: jest.fn().mockRejectedValue(new Error('DB error')) });

        const res = await request(app)
            .get('/api/tempItems')
            .set(authHeader);

        expect(res.status).toBe(500);
    });
});


// GET /:id

describe('GET /api/tempItems/:id', () =>
{
    test('returns the item when found', async () =>
    {
        Item.findOne.mockResolvedValue(fakeItems[0]);

        const res = await request(app)
            .get('/api/tempItems/i1')
            .set(authHeader);

        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Eggs');
    });

    test('returns 404 when item does not exist or belongs to another user', async () =>
    {
        Item.findOne.mockResolvedValue(null);

        const res = await request(app)
            .get('/api/tempItems/notreal')
            .set(authHeader);

        expect(res.status).toBe(404);
    });
});


// POST /

describe('POST /api/tempItems', () =>
{
    test('returns 400 when name is missing', async () =>
    {
        const res = await request(app)
            .post('/api/tempItems')
            .set(authHeader)
            .send({ quantity: 5, unit: 'kg' });

        expect(res.status).toBe(400);
        expect(res.body.msg).toMatch(/item name/i);
    });

    test('creates item and returns updated list on success', async () =>
    {
        const mockItem = { save: jest.fn().mockResolvedValue(true) };
        Item.mockImplementation(() => mockItem);
        Item.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(fakeItems) });

        const res = await request(app)
            .post('/api/tempItems')
            .set(authHeader)
            .send({ name: 'Flour', quantity: 2, unit: 'kg' });

        expect(res.status).toBe(200);
        expect(mockItem.save).toHaveBeenCalled();
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('defaults quantity to 0 when not provided', async () =>
    {
        let savedData = null;
        Item.mockImplementation((data) =>
        {
            savedData = data;
            return { save: jest.fn().mockResolvedValue(true) };
        });
        Item.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });

        await request(app)
            .post('/api/tempItems')
            .set(authHeader)
            .send({ name: 'Salt' });

        expect(savedData.quantity).toBe(0);
    });
});


// PUT /:id

describe('PUT /api/tempItems/:id', () =>
{
    test('returns updated item on success', async () =>
    {
        const updatedItem = { ...fakeItems[0], quantity: 99 };
        Item.findOneAndUpdate.mockResolvedValue(updatedItem);

        const res = await request(app)
            .put('/api/tempItems/i1')
            .set(authHeader)
            .send({ quantity: 99 });

        expect(res.status).toBe(200);
        expect(res.body.item.quantity).toBe(99);
    });

    test('returns 404 when item not found or not owned by user', async () =>
    {
        Item.findOneAndUpdate.mockResolvedValue(null);

        const res = await request(app)
            .put('/api/tempItems/notreal')
            .set(authHeader)
            .send({ quantity: 5 });

        expect(res.status).toBe(404);
    });
});


// DELETE /:id

describe('DELETE /api/tempItems/:id', () =>
{
    test('returns remaining items after deletion', async () =>
    {
        Item.findOneAndDelete.mockResolvedValue(fakeItems[0]);
        Item.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([fakeItems[1]]) });

        const res = await request(app)
            .delete('/api/tempItems/i1')
            .set(authHeader);

        expect(res.status).toBe(200);
        expect(res.body.items).toHaveLength(1);
        expect(res.body.items[0].name).toBe('Butter');
    });

    test('returns 404 when item not found or not owned by user', async () =>
    {
        Item.findOneAndDelete.mockResolvedValue(null);

        const res = await request(app)
            .delete('/api/tempItems/notreal')
            .set(authHeader);

        expect(res.status).toBe(404);
    });
});