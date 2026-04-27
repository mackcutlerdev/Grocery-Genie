const auth = require('./auth');
const jwt  = require('jsonwebtoken');

process.env.JWT_SECRET = 'test-secret';

// Minimal req/res/next fakes, just enough for the middleware to run
const makeReq  = (token) => ({
    headers: { authorization: token ? `Bearer ${token}` : undefined }
});
const makeRes  = () => ({
    status: jest.fn().mockReturnThis(),
    json:   jest.fn().mockReturnThis(),
});
const next = jest.fn();

beforeEach(() => next.mockClear());


describe('auth middleware', () =>
{
    test('calls next() and sets req.userId when token is valid', () =>
    {
        const token = jwt.sign({ userId: 'user123' }, 'test-secret');
        const req   = makeReq(token);
        const res   = makeRes();

        auth(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(req.userId).toBe('user123');
    });

    test('returns 401 when no token is provided', () =>
    {
        const req = makeReq(null);
        const res = makeRes();

        auth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    test('returns 401 when token is invalid', () =>
    {
        const req = makeReq('this.is.garbage');
        const res = makeRes();

        auth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    test('returns 401 when token is signed with wrong secret', () =>
    {
        const token = jwt.sign({ userId: 'user123' }, 'wrong-secret');
        const req   = makeReq(token);
        const res   = makeRes();

        auth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });
});