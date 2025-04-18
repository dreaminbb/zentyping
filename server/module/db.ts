import type { Collection } from "mongoose";
import { MongoClient } from "mongodb";
import { config, available_code_list } from "../config";
import { type code_data, type original_code_data, type user } from "../interface";

class db {


        db: null | any
        user_collection: null | Collection<user>
        python_code_collection: null | Collection<code_data>
        ts_code_collection: null | Collection<code_data>
        rust_code_collection: null | Collection<code_data>
        code_collection_obj: null | { [key: string]: Collection<code_data> | null }

        constructor() {
                this.db = null
                this.user_collection = null
                this.python_code_collection = null
                this.ts_code_collection = null
                this.rust_code_collection = null
                this.code_collection_obj = null
        }

        async init(db_url: string, db_name: string): Promise<void> {
                if (!config.PRODUCTION) {
                        console.log('init db')
                }
                await this.connect_db(db_url, db_name)
                this.python_code_collection = await this.get_collection(config.PYTHON_COLLECTION_NAME as string)
                this.ts_code_collection = await this.get_collection(config.TS_COLLECTION_NAME as string)
                this.rust_code_collection = await this.get_collection(config.RUST_COLLECTION_NAME as string)
                this.init_colletion_obj()
                this.user_collection = await this.get_collection(config.USER_COLLECTION_NAME as string)
                if (!config.PRODUCTION) {
                        console.log('init db done')
                }
        }

        init_colletion_obj() {
                this.code_collection_obj = {
                        python: this.python_code_collection ?? null,
                        typescript: this.ts_code_collection ?? null,
                        rust: this.rust_code_collection ?? null
                }
        }



        async connect_db(db_url: string, db_name: string): Promise<void> {
                try {
                        const client: MongoClient = new MongoClient(db_url as string, {});
                        await client.connect();  // 接続を待機
                        this.db = client.db(db_name as string);

                        console.log('Database connection established');
                } catch (e) {
                        console.error('Database connection failed:', e);
                        throw e;
                }
        }

        async get_collection(name: string): Promise<any> {
                try {
                        console.log(`getting ${name} collection at ${(new Date)}`)
                        if (!this.db) {
                                console.error("failed to get collection because client is null")
                                process.exit(1)
                        }
                        return this.db.collection(name)

                } catch (e) {
                        console.error(e)
                        process.exit(1)
                }
        }


        async create_user(user_github_id: string, github_user_name: string): Promise<boolean> {
                try {
                        const result = await db_class.user_collection?.insertOne({
                                github_id: user_github_id,
                                github_user_name: github_user_name,
                                last_login_time: new Date(),
                                play_info: {
                                        total_play_time: 0,
                                        total_play_count_each_lang: {
                                                python: 0,
                                                typescript: 0,
                                                rust: 0,
                                        },
                                }
                        })
                        if (result) {
                                console.log("user created")
                                return true
                        } else {
                                console.error("failed to create user")
                                return false
                        }
                } catch (e) {
                        console.error(e)
                        return false
                }
        }


        async check_user_exist(user_github_uid: string): Promise<boolean> {
                try {
                        const result = await this.user_collection?.findOne({
                                github_uid: user_github_uid
                        })
                        return result ? true : false
                } catch (e) {
                        console.error(e)
                        return false
                }
        }

        private async fetch_code_author_from_collection(user_github_uid: string, lang: string): Promise<code_data | null> {
                const collection = this.code_collection_obj?.[lang]

                const result = await collection?.find({
                        'author': user_github_uid
                }).toArray()
                if (!result || result.length === 0) {
                        return null
                }
                const tmp = result[0];

                const { _id, author_uid, ...data } = tmp as original_code_data;

                return data
        }

        // this function is used to check if the user name is changed and update the db if it is changed
        // if there is no change, return false , if there is a change return true
        async if_user_name_changed_update_db_user_github_name(user_github_uid: string, github_user_name: string): Promise<boolean | void> {
                try {

                        const result = await this.user_collection?.findOne({
                                github_uid: user_github_uid
                        })

                        if (result?.github_user_name !== github_user_name) {
                                console.log('its not same')
                                await this.user_collection?.updateOne({ github_uid: user_github_uid },
                                        {
                                                $set: { github_user_name: github_user_name }
                                        })
                                //  todo update code doc author name

                                return true
                        } else {
                                console.log('its same')
                        }


                } catch (e) {
                        console.error(e)
                        return undefined
                }
        }

        async fetch_code_use_github_uid(user_github_uid: string): Promise<{ exist: boolean, code_data?: object | null } | undefined> {
                try {

                        let code_data: {
                                [key: string]: code_data | null
                        } = {}

                        for (const lang of available_code_list) {
                                const result = await this.fetch_code_author_from_collection(user_github_uid, lang)
                                code_data[lang] = result as code_data | null
                        }

                        const all_null: boolean = Object.values(code_data).every(value => value === null);

                        if (all_null) {
                                return {
                                        exist: false, code_data: null
                                }
                        } else {

                                return { exist: true, code_data: code_data as any };
                        }

                } catch (e) {
                        console.error(e)
                        return undefined
                }
        }
}

const db_class = new db()

export default db_class
