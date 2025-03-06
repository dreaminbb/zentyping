import express, { type Request, type Response } from 'express';
import { config } from './config';
import db_class from './module/db'
import code_router from './router/code';
const bodyParser = require('body-parser');
export const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
db_class.init()
console.log(db_class.code_collection_obj)
app.use('/code', code_router);

app.get('/', (req: Request, res: Response) => {
                console.log(req)
                res.send('hello express');
});


app.listen(config.API_HOST_PORT, () => {
                console.log(`Server is running on http://localhost:${config.API_HOST_PORT}`);
});

function cors(arg0: { origin: (origin: any, callback: any) => void; }): any {
                throw new Error('Function not implemented.');
}
