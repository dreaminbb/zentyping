import express from 'express';
import { type Request, type Response, type NextFunction } from 'express';
import morgan from 'morgan'
import prod_middleware from './middleware/prod';
import dev_middelware from './middleware/dev';
import { config } from './config';
import db_class from './module/db'
import code_router from './router/code';
import auth_router from './router/auth'
import path from 'path'
export const app = express();
const index_file: string = path.join(__dirname, "static", "index.html")


app.use(morgan('combined'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`/assets`, express.static(path.join(__dirname, 'static', 'assets')));
app.use('/md', express.static(path.join(__dirname, 'static/md')));



app.use((req: Request, res: Response, next: NextFunction) => {
  if (config.PRODUCTION && req.path.startsWith(`${config.DEV_URL}/`)) {
    res.status(404).json({ error: 'Not found in production' });
    return
  }

  if (config.PRODUCTION) {
    prod_middleware.prod_mode(req, res, next);
  } else {
    dev_middelware.dev_mode(req, res, next);
  }
});

// Move CORS middleware to be first in the chain

// * これでdb classの変数にコレクションが追加されたから他のコードからコレクションを使うことができる。
await db_class.init()
const add_url: string = config.PRODUCTION ? '' : config.DEV_URL as string
console.log(add_url, 'add url')
// app.use(`${add_url}/api/code`, code_router);
// app.use(`${add_url}/api/auth`, auth_router)
app.use('/api/code', code_router);
app.use('/api/auth', auth_router)


app.get(`/`, (req: Request, res: Response) => {

  if (!config.PRODUCTION) {
    console.log('index file request');
  }
  //  console.log(req)
  res.sendFile(index_file) /* html file */
});


app.listen(config.API_HOST_PORT, () => {
  console.log(`Server is running on http://localhost:${config.API_HOST_PORT}`);
});
