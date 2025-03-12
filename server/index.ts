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

const is_production: boolean = config.PRODUCTION === 'true'
console.log('is production', is_production)
console.log(typeof is_production)

const allowedOrigins = is_production
  ? [process.env.SITE_ORIGIN] // 本番環境
  : ['http://localhost:8000', 'http://127.0.0.1', process.env.SITE_ORIGIN]; // 開発環境

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    console.log('Request from origin:', origin);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Rejected origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
};



//app.use((req, res, next) => {
//	if(!is_production){
  //const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  //const geo = geoip.lookup(ip);

  //if (geo && geo.country === "JP") {
    //next(); // 日本なら通す
 // } else {
   // res.status(403).send("Access denied");
  //}
//	}
//});


// Move CORS middleware to be first in the chain
app.use(cors(corsOptions));
// * これでdb classの変数にコレクションが追加されたから他のコードからコレクションを使うことができる。
await db_class.init()

app.use('/api/code', code_router);

app.get('/', (req: Request, res: Response) => {
  console.log(req)
  res.sendFile(index_file) /* html file */
});


app.listen(config.API_HOST_PORT, () => {
  console.log(`Server is running on http://localhost:${config.API_HOST_PORT}`);
});
