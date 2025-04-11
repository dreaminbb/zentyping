import jwt from 'jsonwebtoken';
import { type unsignined_jwt_payload, type signined_jwt_payload } from '../../interface'
import { config } from '../../config';


export function create_token(payload: unsignined_jwt_payload | signined_jwt_payload): string | void {

                return jwt.sign(payload, config.JWT_SECRET_KEY, {
                                expiresIn: parseInt(config.JWT_EXPIRATION_TIME)
                });
}

export function verify_token(token: string): unsignined_jwt_payload | signined_jwt_payload | void {
                try {
                                return jwt.verify(token, config.JWT_SECRET_KEY) as unsignined_jwt_payload | signined_jwt_payload;
                } catch (err) {
                                console.error(err);
                }
}