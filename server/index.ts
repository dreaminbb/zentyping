import express, { type Request, type Response } from 'express';
import { config } from './config';
import { connect_db } from './module/db';


// app.get('/', (req: Request, res: Response) => {
//                 res.send('Hello, world!');
// });

// app.listen(port, () => {
//                 console.log(`Server is running on http://localhost:${port}`);
// });