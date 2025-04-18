import { user_info } from "@/store/store"
import { fetch_with_middleware } from "./middleware/check_dev_mode";

async function siginup_send_github_id_to_server(id: string, name: string): Promise<void> {

                try {
                                if (!user_info().token) {
                                                // console.error('Token is not available in user_info store');
                                                return;
                                }

                                const url: string = import.meta.env['VITE_SGINUP_URL'] as string
                                const method: string = 'POST' as string
                                const body: object = { github_user_id: id, github_user_name: name }
                                const data = await fetch_with_middleware(url, method, body);
                                
                                if (data) {
                                                console.info('login sucessed')
                                } else {
                                                console.warn('login failed')
                                }
                                // console.log(config.is_production ?? 'response', response);
                }
                catch (e) {
                                console.error('Error sending GitHub ID to server:', e)
                }
}


export { siginup_send_github_id_to_server }