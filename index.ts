import type { Request, Response } from 'express';
const express = require('express');
const cookieParser = require('cookie-parser');
const { connectDB, disconnectDB } = require('./src/db');

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.get('/REST', (req: Request, res: Response) => {
    res.send('RESTAPI!');
});

const { postsRouter } = require('./src/routes/posts');
app.use('/post', postsRouter);
const { commentsRouter } = require('./src/routes/comments');
app.use('/comment', commentsRouter);
const { usersRouter } = require('./src/routes/users');
app.use('/', usersRouter);
// Swagger UI (optional). If `swagger-ui-express` is not installed, this will be skipped.
try {
    const swaggerUi = require('swagger-ui-express');
    let swaggerSpecRaw;
    try {
        // prefer TS module when running under ts-node/ts-jest
        swaggerSpecRaw = require('./src/swagger');
    } catch (e) {
        // fallback to JSON spec for plain node environments
        swaggerSpecRaw = require('./src/swagger.json');
    }
    // normalize CommonJS/ESM default export
    const swaggerSpec = swaggerSpecRaw && swaggerSpecRaw.default ? swaggerSpecRaw.default : swaggerSpecRaw;
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} catch (e) {
    console.warn('swagger-ui-express not installed; /docs disabled');
}
const { errorHandler } = require('./src/middleware/errorHandler');
app.use(errorHandler);

async function start() {
    try {
        await connectDB();
    } catch (err) {
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