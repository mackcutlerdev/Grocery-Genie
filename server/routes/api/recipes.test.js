const request = require('supertest');
const express = require('express');
const jwt     = require('jsonwebtoken');

process.env.JWT_SECRET = 'test-secret';

jest.mock('../../models/Recipe');
const Recipe = require('../../models/Recipe');

const app = express();
app.use(express.json());
app.use('/api/tempRecipes', require('./recipes'));

const USER_ID    = 'user222';
const validToken = jwt.sign({ userId: USER_ID }, 'test-secret');
const authHeader = { Authorization: `Bearer ${validToken}` };

const fakeRecipes = [
    {
        id:           'r1',
        name:         'Omelette',
        userId:       USER_ID,
        ingredients:  [{ name: 'Eggs', quantity: 3, unit: 'Unit' }],
        instructions: ['Crack eggs', 'Cook'],
        prep:         '10 min',
        servings:     2,
    },
    {
        id:           'r2',
        name:         'Toast',
        userId:       USER_ID,
        ingredients:  [{ name: 'Bread', quantity: 2, unit: 'Unit' }],
        instructions: ['Toast it'],
        prep:         '5 min',
        servings:     1,
    },
];

beforeEach(() => jest.clearAllMocks());


// Auth guard

describe('auth guard on recipes routes', () =>
{
    test('returns 401 when no token is provided', async () =>
    {
        const res = await request(app).get('/api/tempRecipes');
        expect(res.status).toBe(401);
    });
});


// GET /

describe('GET /api/tempRecipes', () =>
{
    test('returns all recipes for the logged-in user', async () =>
    {
        Recipe.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(fakeRecipes) });

        const res = await request(app)
            .get('/api/tempRecipes')
            .set(authHeader);

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body[0].name).toBe('Omelette');
    });

    test('returns 500 on database error', async () =>
    {
        Recipe.find.mockReturnValue({ sort: jest.fn().mockRejectedValue(new Error('DB error')) });

        const res = await request(app)
            .get('/api/tempRecipes')
            .set(authHeader);

        expect(res.status).toBe(500);
    });
});


// GET /:id

describe('GET /api/tempRecipes/:id', () =>
{
    test('returns the recipe when found', async () =>
    {
        Recipe.findOne.mockResolvedValue(fakeRecipes[0]);

        const res = await request(app)
            .get('/api/tempRecipes/r1')
            .set(authHeader);

        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Omelette');
    });

    test('returns 404 when recipe does not exist or belongs to another user', async () =>
    {
        Recipe.findOne.mockResolvedValue(null);

        const res = await request(app)
            .get('/api/tempRecipes/notreal')
            .set(authHeader);

        expect(res.status).toBe(404);
    });
});


// POST /

describe('POST /api/tempRecipes', () =>
{
    test('returns 400 when name is missing', async () =>
    {
        const res = await request(app)
            .post('/api/tempRecipes')
            .set(authHeader)
            .send({ ingredients: [] });

        expect(res.status).toBe(400);
        expect(res.body.msg).toMatch(/recipe name/i);
    });

    test('creates recipe and returns updated list on success', async () =>
    {
        const mockRecipe = { save: jest.fn().mockResolvedValue(true) };
        Recipe.mockImplementation(() => mockRecipe);
        Recipe.find.mockReturnValue({ sort: jest.fn().mockResolvedValue(fakeRecipes) });

        const res = await request(app)
            .post('/api/tempRecipes')
            .set(authHeader)
            .send({
                name:         'Pancakes',
                ingredients:  [{ name: 'Flour', quantity: 2, unit: 'cup' }],
                instructions: ['Mix', 'Cook'],
            });

        expect(res.status).toBe(200);
        expect(mockRecipe.save).toHaveBeenCalled();
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('defaults ingredients and instructions to empty arrays when not provided', async () =>
    {
        let savedData = null;
        Recipe.mockImplementation((data) =>
        {
            savedData = data;
            return { save: jest.fn().mockResolvedValue(true) };
        });
        Recipe.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });

        await request(app)
            .post('/api/tempRecipes')
            .set(authHeader)
            .send({ name: 'Mystery Dish' });

        expect(savedData.ingredients).toEqual([]);
        expect(savedData.instructions).toEqual([]);
    });
});


// PUT /:id

describe('PUT /api/tempRecipes/:id', () =>
{
    test('returns updated recipe on success', async () =>
    {
        const updated = { ...fakeRecipes[0], name: 'Cheese Omelette' };
        Recipe.findOneAndUpdate.mockResolvedValue(updated);

        const res = await request(app)
            .put('/api/tempRecipes/r1')
            .set(authHeader)
            .send({ name: 'Cheese Omelette' });

        expect(res.status).toBe(200);
        expect(res.body.recipe.name).toBe('Cheese Omelette');
    });

    test('returns 404 when recipe not found or not owned by user', async () =>
    {
        Recipe.findOneAndUpdate.mockResolvedValue(null);

        const res = await request(app)
            .put('/api/tempRecipes/notreal')
            .set(authHeader)
            .send({ name: 'Whatever' });

        expect(res.status).toBe(404);
    });
});


// DELETE /:id 

describe('DELETE /api/tempRecipes/:id', () =>
{
    test('returns remaining recipes after deletion', async () =>
    {
        Recipe.findOneAndDelete.mockResolvedValue(fakeRecipes[0]);
        Recipe.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([fakeRecipes[1]]) });

        const res = await request(app)
            .delete('/api/tempRecipes/r1')
            .set(authHeader);

        expect(res.status).toBe(200);
        expect(res.body.recipes).toHaveLength(1);
        expect(res.body.recipes[0].name).toBe('Toast');
    });

    test('returns 404 when recipe not found or not owned by user', async () =>
    {
        Recipe.findOneAndDelete.mockResolvedValue(null);

        const res = await request(app)
            .delete('/api/tempRecipes/notreal')
            .set(authHeader);

        expect(res.status).toBe(404);
    });
});