// Dependencies & Start Server
const express = require('express');
const logger = require('./middleware/logger');
const server = express();

const PORT = 5000;

// Middleware
server.use(logger);
server.use(express.json());
server.use(express.urlencoded({extended: false}));

// Routing
server.use('/api/tempItems', require('./routes/api/items'));

// LISTEN
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));