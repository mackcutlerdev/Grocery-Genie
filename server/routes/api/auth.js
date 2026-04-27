const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const User     = require('../../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) =>
{
    const { username, password } = req.body;

    // Basic presence checks
    if (!username || !username.trim())
        return res.status(400).json({ msg: 'Username is required' });

    if (!password)
        return res.status(400).json({ msg: 'Password is required' });

    // Mirror the client-side password rules so the API can't be bypassed
    if (password.trim().length === 0)
        return res.status(400).json({ msg: 'Password cannot be spaces only' });

    if (password.length < 6)
        return res.status(400).json({ msg: 'Password must be at least 6 characters' });

    if (!/[A-Z]/.test(password))
        return res.status(400).json({ msg: 'Password must include at least one uppercase letter' });

    if (!/[0-9]/.test(password))
        return res.status(400).json({ msg: 'Password must include at least one number' });

    try
    {
        // Case-insensitive duplicate username check
        const existing = await User.findOne({
            username: { $regex: new RegExp(`^${username.trim()}$`, 'i') }
        });

        if (existing)
            return res.status(400).json({ msg: 'Username already taken' });

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            username: username.trim(),
            passwordHash,
        });

        await user.save();

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
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

// POST /api/auth/login
router.post('/login', async (req, res) =>
{
    const { username, password } = req.body;

    if (!username || !password)
        return res.status(400).json({ msg: 'Username and password are required' });

    try
    {
        const user = await User.findOne({
            username: { $regex: new RegExp(`^${username.trim()}$`, 'i') }
        });

        if (!user)
            return res.status(400).json({ msg: 'Invalid username or password' });

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