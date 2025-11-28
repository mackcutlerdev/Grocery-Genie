// Dependencies & Start Server
const express = require('express');
const logger = require('./middleware/logger');
const server = express();
const path = require('path');

// PORT
const PORT = process.env.PORT || 5000;

// Middleware
server.use(logger);
server.use(express.json());
server.use(express.urlencoded({extended: false}));

// API Routing
server.use('/api/tempItems', require('./routes/api/items'));
server.use('/api/tempRecipes', require('./routes/api/recipes'));

// Added for the Render web services
// Serve React client in production
// NOW serve React build (must be LAST)
if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path.join(__dirname, '../client/build');
    console.log('Serving static from:', clientBuildPath);

    server.use(express.static(clientBuildPath));

    // Express 5: wildcard route must use regex
    server.get(/.*/, (req, res) => {
        res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
}

// LISTEN
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));