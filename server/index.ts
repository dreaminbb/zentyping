import express, { type Request, type Response } from 'express';
import { config } from './config';

const app = express();

app.get('/', (req: Request, res: Response) => {
                res.send('Hello, world!');
});

app.listen(config.port, () => {
                console.log(`Server is running on http://localhost:${config.port}`);
});