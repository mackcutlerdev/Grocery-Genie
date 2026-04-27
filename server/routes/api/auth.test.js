const request  = require('supertest');
const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');

process.env.JWT_SECRET = 'test-secret';

// Mock the User model so no real DB is needed
jest.mock('../../models/User');
const User = require('../../models/User');

// Build a minimal Express app with just the auth router
const app = express();
app.use(express.json());
app.use('/api/auth', require('./auth'));


// Register

describe('POST /api/auth/register', () =>
{
    beforeEach(() => jest.clearAllMocks());

    test('returns 400 when username is missing', async () =>
    {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ password: 'Password1' });

        expect(res.status).toBe(400);
        expect(res.body.msg).toMatch(/username is required/i);
    });

    test('returns 400 when password is too short', async () =>
    {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: 'john', password: 'abc' });

        expect(res.status).toBe(400);
        expect(res.body.msg).toMatch(/at least 6 characters/i);
    });

    test('returns 400 when username is already taken', async () =>
    {
        // Simulate findOne returning an existing user
        User.findOne.mockResolvedValue({ username: 'john' });

        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: 'john', password: 'Password1' });

        expect(res.status).toBe(400);
        expect(res.body.msg).toMatch(/already taken/i);
    });

    test('returns 201 with token and user on success', async () =>
    {
        // No existing user found
        User.findOne.mockResolvedValue(null);

        // Mock the save() call on a new User instance
        const mockUser = {
            _id:      'abc123',
            username: 'john',
            save:     jest.fn().mockResolvedValue(true),
        };
        User.mockImplementation(() => mockUser);

        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: 'john', password: 'Password1' });

        expect(res.status).toBe(201);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.username).toBe('john');
    });

    test('returns 500 on unexpected database error', async () =>
    {
        User.findOne.mockRejectedValue(new Error('DB exploded'));

        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: 'john', password: 'Password1' });

        expect(res.status).toBe(500);
    });
});


// Login

describe('POST /api/auth/login', () =>
{
    beforeEach(() => jest.clearAllMocks());

    test('returns 400 when fields are missing', async () =>
    {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: 'john' });

        expect(res.status).toBe(400);
        expect(res.body.msg).toMatch(/required/i);
    });

    test('returns 400 when username does not exist', async () =>
    {
        User.findOne.mockResolvedValue(null);

        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: 'ghost', password: 'Password1' });

        expect(res.status).toBe(400);
        expect(res.body.msg).toMatch(/invalid username or password/i);
    });

    test('returns 400 when password does not match', async () =>
    {
        const hash = await bcrypt.hash('correctPassword', 10);
        User.findOne.mockResolvedValue({ _id: 'abc123', username: 'john', passwordHash: hash });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: 'john', password: 'wrongPassword' });

        expect(res.status).toBe(400);
        expect(res.body.msg).toMatch(/invalid username or password/i);
    });

    test('returns token and user on successful login', async () =>
    {
        const hash = await bcrypt.hash('Password1', 10);
        User.findOne.mockResolvedValue({ _id: 'abc123', username: 'john', passwordHash: hash });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: 'john', password: 'Password1' });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.username).toBe('john');
    });

    test('token contains correct userId', async () =>
    {
        const hash = await bcrypt.hash('Password1', 10);
        User.findOne.mockResolvedValue({ _id: 'abc123', username: 'john', passwordHash: hash });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: 'john', password: 'Password1' });

        const decoded = jwt.verify(res.body.token, 'test-secret');
        expect(decoded.userId).toBe('abc123');
    });

    test('returns 500 on unexpected database error', async () =>
    {
        User.findOne.mockRejectedValue(new Error('DB exploded'));

        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: 'john', password: 'Password1' });

        expect(res.status).toBe(500);
    });
});