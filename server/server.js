// Load .env variables first, before anything else reads process.env
require('dotenv').config();

const express   = require('express');
const mongoose  = require('mongoose');
const logger    = require('./middleware/logger');
const path      = require('path');

const server = express();
const PORT   = process.env.PORT || 5000;

// ── Connect to MongoDB ─────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) =>
    {
        console.error('MongoDB connection error:', err.message);
        // Exit hard — no point running if there's no database
        process.exit(1);
    });

// ── Middleware ─────────────────────────────────────────────────────────────
server.use(logger);
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// ── API Routes ─────────────────────────────────────────────────────────────
// Keeping /api/tempItems and /api/tempRecipes URLs so the client
// doesn't need to change a single fetch call for Phase 1.
// We'll rename them to /api/items and /api/recipes in Phase 3
// when we update the client anyway for auth headers.
server.use('/api/tempItems',   require('./routes/api/items'));
server.use('/api/tempRecipes', require('./routes/api/recipes'));

// ── Serve React build in production ───────────────────────────────────────
if (process.env.NODE_ENV === 'production')
{
    const clientBuildPath = path.join(__dirname, '../client/build');
    console.log('Serving static from:', clientBuildPath);

    server.use(express.static(clientBuildPath));

    // Catch-all: any route that isn't an API route serves the React app
    server.get(/.*/, (req, res) =>
    {
        res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
}

// ── Start ──────────────────────────────────────────────────────────────────
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));