"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { connectDB, disconnectDB } = require('./src/db');
const app = express();
const port = Number(process.env.PORT) || 3000;
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/REST', (req, res) => {
    res.send('RESTAPI!');
});
const { postsRouter } = require('./src/routes/posts');
app.use('/post', postsRouter);
const { commentsRouter } = require('./src/routes/comments');
app.use('/comment', commentsRouter);
const { errorHandler } = require('./src/middleware/errorHandler');
app.use(errorHandler);
async function start() {
    try {
        await connectDB();
    }
    catch (err) {
        console.error('Failed to connect to DB, exiting', err);
        process.exit(1);
    }
    const server = app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
    const shutdown = async () => {
        console.log('Shutting down...');
        server.close(async () => {
            await disconnectDB();
            process.exit(0);
        });
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
}
// Only start the server if this file is run directly.
if (require.main === module) {
    start();
}
module.exports = app;
//# sourceMappingURL=index.js.map