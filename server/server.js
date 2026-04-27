require('dotenv').config();

const express   = require('express');
const mongoose  = require('mongoose');
const logger    = require('./middleware/logger');
const path      = require('path');

const server = express();
const PORT   = process.env.PORT || 5000;

// Connect to MongoDB 
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) =>
    {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });

// Middleware 
server.use(logger);
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// API Routes
// Auth is public, no JWT needed to register or login
server.use('/api/auth',        require('./routes/api/auth'));

// Data routes, protected by JWT inside each router via auth middleware
server.use('/api/tempItems',   require('./routes/api/items'));
server.use('/api/tempRecipes', require('./routes/api/recipes'));

// Serve React build in production 
if (process.env.NODE_ENV === 'production')
{
    const clientBuildPath = path.join(__dirname, '../client/build');
    console.log('Serving static from:', clientBuildPath);

    server.use(express.static(clientBuildPath));

    server.get(/.*/, (req, res) =>
    {
        res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
}

// Start
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));