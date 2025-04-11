import auth from '../api/auth'


export async function loading_setup(): Promise<void> {

                await auth.get_token_overwrite_store_token_fail_throw_error()
}
