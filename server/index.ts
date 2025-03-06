import express from 'express';
import  { type Request, type Response } from 'express';
import cors from 'cors';
import { config } from './config';
import db_class from './module/db'
import code_router from './router/code';
export const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// * これでdb classの変数にコレクションが追加されたから他のコードからコレクションを使うことができる。

app.use(cors({
                origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
                                if (!origin || (config.SITE_ORIGIN as string).includes(origin)) {
                                                callback(null, true);
                                } else {
                                                callback(new Error('CORS policy violation'));
                                }
                }
}));

await db_class.init()
app.use('/code', code_router);

app.get('/', (req: Request, res: Response) => {
                console.log(req)
                res.send('hello express');
});


app.listen(config.API_HOST_PORT, () => {
                console.log(`Server is running on http://localhost:${config.API_HOST_PORT}`);
});

