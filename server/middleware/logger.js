// Kinda useless, but was one of the first things I made and I found it useful enough for debugging
const logger = (req, res, next) => {
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
}

module.exports = logger;