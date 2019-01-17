// This file will start up the node server
const cookieParser = require('cookie-parser');
// Adds the environment variables into the process global variable
require('dotenv').config({ path: 'variables.env'});
const createServer = require('./createServer');
const db = require('./db');
const jwt = require('jsonwebtoken');


const server = createServer();

// TODO Use Express middleware to handle cookies
server.express.use(cookieParser());
// TODO Use Express middleware to populate current user

server.express.use((req, res, next) => {
    const  { token } = req.cookies;
    if (token) {
        // Put the userId into the req for future requests to access
        const {userId} = jwt.verify(token, process.env.APP_SECRET);
        req.userId = userId; 
    }
    next();
})

server.express.use(async (req, res, next) => {
    // If they aren't logged in, skip this
    if (!req.userId) return next();
    const user = await db.query.user({where: {id: req.userId}}, '{id, permissions, email, name}');
    req.user = user;
    return next();
})

server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL
    }
}, res => {
    console.log(`Server is now running on http://localhost:${process.env.PORT}`)
});