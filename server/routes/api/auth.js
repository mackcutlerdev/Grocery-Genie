const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const User     = require('../../models/User');

// ── POST /api/auth/register ────────────────────────────────────────────────
// Creates a new user. Returns a JWT on success so the client is
// immediately logged in without a second round-trip.
router.post('/register', async (req, res) =>
{
    const { username, password } = req.body;

    // Basic validation
    if (!username || !username.trim())
        return res.status(400).json({ msg: 'Username is required' });

    if (!password || password.length < 6)
        return res.status(400).json({ msg: 'Password must be at least 6 characters' });

    try
    {
        // Check if username is already taken (case-insensitive)
        const existing = await User.findOne({
            username: { $regex: new RegExp(`^${username.trim()}$`, 'i') }
        });

        if (existing)
            return res.status(400).json({ msg: 'Username already taken' });

        // Hash the password — 10 salt rounds is the standard sweet spot
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            username: username.trim(),
            passwordHash,
        });

        await user.save();

        // Sign a JWT containing just the userId
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }   // token valid for 7 days
        );

        res.status(201).json({
            token,
            user: { id: user._id, username: user.username },
        });
    }
    catch (err)
    {
        console.error('Register error:', err.message);
        res.status(500).json({ msg: 'Server error during registration' });
    }
});

// ── POST /api/auth/login ───────────────────────────────────────────────────
// Verifies credentials. Returns a JWT on success.
router.post('/login', async (req, res) =>
{
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(400).json({ msg: 'Username and password are required' });

    try
    {
        // Case-insensitive username lookup
        const user = await User.findOne({
            username: { $regex: new RegExp(`^${username.trim()}$`, 'i') }
        });

        if (!user)
            return res.status(400).json({ msg: 'Invalid username or password' });

        // Compare submitted password against stored hash
        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch)
            return res.status(400).json({ msg: 'Invalid username or password' });

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: { id: user._id, username: user.username },
        });
    }
    catch (err)
    {
        console.error('Login error:', err.message);
        res.status(500).json({ msg: 'Server error during login' });
    }
});

module.exports = router;