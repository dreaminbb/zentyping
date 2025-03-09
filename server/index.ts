import express from 'express';
import { type Request, type Response } from 'express';
import morgan from 'morgan'
import cors from 'cors';
import { config } from './config';
import db_class from './module/db'
import code_router from './router/code';
import path from 'path'
export const app = express();
const index_file: string = path.join(__dirname, "static", "index.html")

app.use(morgan('combined'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/static', express.static(path.join(__dirname, 'static')))

app.use(cors({
                origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
                                if (!origin || (config.SITE_ORIGIN as string).includes(origin)) {
                                                callback(null, true);
                                } else {
                                                callback(new Error('CORS policy violation'));
                                }
                }
}));

// * これでdb classの変数にコレクションが追加されたから他のコードからコレクションを使うことができる。
await db_class.init()

app.use('/code', code_router);

app.get('/', (req: Request, res: Response) => {
                console.log(req)
                res.sendFile(index_file) /* html file */                
});


app.listen(config.API_HOST_PORT, () => {
                console.log(`Server is running on http://localhost:${config.API_HOST_PORT}`);
});
