import type { signined_jwt_payload } from '../../interface'
import db_class from '../db'
import { create_token } from './jwt'

async function handle_sign_in(user_github_uid: string, user_github_name: string): Promise<{ status: number, message: string, token?: string }> {

                //check if the usrer is already in the database
                const user_data: boolean = await db_class.user_collection?.findOne({ github_id: user_github_uid }) ? true : false


                if (user_data) {
                                try {

                                                //update the user's last login time
                                                const result = await db_class.user_collection?.updateOne(
                                                                { github_id: user_github_uid },
                                                                { $set: { last_login_time: new Date() } }
                                                )

                                                // if username is changed, update the db
                                                await db_class.if_user_name_changed_update_db_user_github_name(user_github_uid, user_github_name)

                                                if (!result) return {
                                                                status: 500,
                                                                message: "failed to update user's last login time",
                                                }

                                                console.log("user's last login time updated")

                                                const data: signined_jwt_payload = {
                                                                sub: user_github_uid,
                                                                iat: Date.now(),
                                                }

                                                const token: string = create_token(data) as string

                                                return {
                                                                token: token,
                                                                status: 200,
                                                                message: "user's last login time updated",
                                                }

                                } catch (e) {
                                                console.error(e)
                                                return {
                                                                status: 500,
                                                                message: "failed to update user's last login time",
                                                }
                                }

                } else {
                                // create a new user            
                                try {

                                                await db_class.create_user(user_github_uid , user_github_name)


                                                const data: signined_jwt_payload = {
                                                                sub: user_github_uid,
                                                                github_user_name: user_github_name,
                                                                iat: Date.now(),
                                                }

                                                const token: string = create_token(data) as string

                                                return {
                                                                token: token,
                                                                status: 200,
                                                                message: "successfully user created!!!",
                                                }
                                } catch (e) {
                                                console.error(e)
                                                return {
                                                                status: 500,
                                                                message: "failed to create user",
                                                }
                                }
                }

}

export { handle_sign_in }