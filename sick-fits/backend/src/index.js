// This file will start up the node server

// Adds the environment variables into the process global variable
require('dotenv').config({ path: 'variables.env'});
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// TODO Use Express middleware to handle cookies
// TODO Use Express middleware to populate current user

server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL
    }
}, res => {
    console.log(`Server is now running on http://localhost:${process.env.PORT}`)
});