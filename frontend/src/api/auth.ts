import config from '@/config';
import { user_info } from '../store/store'
import { fetch_with_middleware } from './middleware/check_dev_mode'

class auth {

                async get_token(): Promise<string | null> {
                                try {
                                                // Simulate token retrieval logic
                                                // console.log(import.meta.env['VITE_FETCH_JWT_URL'])

                                                const url = import.meta.env['VITE_FETCH_JWT_URL'] as string
                                                const method = 'POST' as string

                                                const data = await fetch_with_middleware(url, method as string);

                                                const token = data === null ? null : data.token as string;

                                                return token;
                                } catch (e) {
                                                console.error("Error retrieving token:", e);
                                                return null;
                                }
                }

                async get_token_overwrite_store_token_fail_throw_error(): Promise<string | void> {

                                if (!config.is_production && !config.is_test_with_server) {
                                                return
                                }
                                const token = await this.get_token();

                                if (!token) {
                                                throw new Error('Token retrieval failed');
                                }

                                user_info().update_token(token);
                                return token;
                }

}

export default new auth();