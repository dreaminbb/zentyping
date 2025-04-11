import { signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { auth, provider } from './firebase';
import { user_info, user_status } from '@/store/store';
import { siginup_send_github_id_to_server } from '@/api/sginup_in';

async function sgin_in_with_github(): Promise<{ user: any; token: string | undefined } | void> {
                try {
                                const result = await signInWithPopup(auth, provider);
                                const credential = GithubAuthProvider.credentialFromResult(result);
                                const token: string | undefined = credential?.accessToken;
                                const user = result.user;
                                console.info(typeof result, credential, 'type')
                                console.log('user', user)
                                console.log('token', token)

                                return { user, token };
                } catch (error) {
                                console.error('Error signing in with GitHub:', error);
                }
}

async function handle_sgin_in(): Promise<void> {

                if (!import.meta.env['VITE_PRODUCTION'] && !import.meta.env['VITE_TEST_WITH_SERVER']) return

                try {
                                const data = await sgin_in_with_github()

                                if (!data) {
                                                console.error('Sign-in failed')
                                                return
                                }

                                // update store info here
                                try {
                                                const github_uid = data.user.uid

                                                await siginup_send_github_id_to_server(github_uid);
                                                user_info().update_user_info(data.user.displayName, data.user.uid, data.user.photoURL)
                                                user_status().is_login = true
                                } catch (e) {
                                                console.error('Error sending GitHub ID to server', e)
                                }
                } catch (e) {
                                console.error('Sign-in failed', e)
                }
}


async function handle_sign_out(): Promise<void> {
                try {
                                await auth.signOut();
                                user_info().init_user_info()
                                user_status().init_status()
                                // console.log('User signed out');
                } catch (error) {
                                console.error('Error signing out:', error);
                }
}

export { sgin_in_with_github, handle_sgin_in, handle_sign_out };