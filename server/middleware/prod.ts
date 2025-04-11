import { config } from "../config";
import { verify_token } from "../module/auth/jwt";
import { urlencoded, type Request, type Response } from "express";

class prod_middleware {
                prod_mode(req: Request, res: Response, next: Function) {


                                const token = req.headers.authorization?.split(' ')[1] ?? undefined;

                                console.log('url', req.url)
                                console.log(req.url === '/api/code/fetch')
                                if (req.url === '/api/auth/token') {
                                                next()
                                }

                                if (req.url === '/api/code/fetch') {
                                                try {
                                                                if (!token) {
                                                                                res.status(401).json({ error: 'Token not provided' });
                                                                                return;
                                                                }
                                                                const decoded = verify_token(token);
                                                                if (decoded) {

                                                                                return next();
                                                                } else {
                                                                                console.error('not good motherfucker')
                                                                }
                                                } catch (error) {
                                                                console.error('Token verification failed:', error);
                                                }

                                } else {
                                                res.status(401)
                                }
                                next()
                }
}

export default new prod_middleware();