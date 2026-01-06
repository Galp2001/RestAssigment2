import type { Request, Response } from 'express';
const express = require('express');
const app = express();
const port = Number(process.env.PORT) || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.get('/REST', (req: Request, res: Response) => {
    res.send('RESTAPI!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;