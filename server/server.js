// Dependencies & Start Server
const express = require('express');
const logger = require('./middleware/logger');
const server = express();
const path = require('path');

// Middleware
server.use(logger);
server.use(express.json());
server.use(express.urlencoded({extended: false}));

// API Routing
server.use('/api/tempItems', require('./routes/api/items'));
server.use('/api/tempRecipes', require('./routes/api/recipes'));

// Added for the Render web services
// Serve React client in production
if (process.env.NODE_ENV === 'production') {
    server.use(express.static(path.join(__dirname, '../client/build')));

    // Catch-all route for React Router
    server.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}

// LISTEN
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));