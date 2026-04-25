const jwt = require('jsonwebtoken');

// Attach this middleware to any route that requires a logged-in user.
// On success it adds req.userId so the route handler knows whose data to touch.
// On failure it returns 401 immediately and the route handler never runs.
const auth = (req, res, next) =>
{
    // The client sends: Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // grab the part after "Bearer "

    if (!token)
        return res.status(401).json({ msg: 'No token — authorisation denied' });

    try
    {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;   // available to every route handler downstream
        next();
    }
    catch (err)
    {
        // verify() throws if the token is expired or tampered with
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = auth;