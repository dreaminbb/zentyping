//This is the middleware that will indentify nomal user or dev

import { config } from "../config";
import type { Request, Response } from 'express';

class dev_middleware {

                dev_mode(req: Request, res: Response, next: Function) {
                                console.log(config.PRODUCTION ?? `[${new Date().toISOString()}] ${req.method} ${req.url} ${req.headers['authorization']}`);
                                console.log(config.PRODUCTION ?? `[${new Date().toISOString()}] ${req.method} ${req.url} ${req.headers.authorization}`);
                                console.log(req.originalUrl, 'origin', '\n')
                                console.log(req.url, 'url', '\n')
                                console.log(config.PRODUCTION ?? req.headers.authorization?.split(' ')[1], 'token')
                                console.log(config.PRODUCTION ?? req.originalUrl, 'origin')


                                // * things I want to do is if req to devurl require token and pass it to next
                                const token = req.headers.authorization?.split(' ')[1];
                                console.log(config.DEV_ROOT_URL ?? 'dev url', 'dev url')
                                if (req.url === '/' || token === config.DEVONLY_API_KEY) {
                                                console.info('pass')
                                                next()
                                } else {
                                                res.status(401).json({ message: 'Unauthorized haha' })
                                }

                }
}

export default new dev_middleware();