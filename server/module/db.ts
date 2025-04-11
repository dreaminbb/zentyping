import type { Collection } from "mongoose";
import { MongoClient } from "mongodb";
import { config } from "../config";
import { type code_data, type user } from "../interface";

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

        async init(): Promise<void> {
                if (!config.PRODUCTION) {
                        console.log('init db')
                }
                await this.connect_db()
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



        async connect_db(): Promise<void> {
                try {
                        const client: MongoClient = new MongoClient(config.DB_URL as string, {});
                        await client.connect();  // 接続を待機
                        this.db = client.db(config.DB_NAME as string);

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


        async create_user(user_github_id: string): Promise<boolean> {
                try {
                        const result = await db_class.user_collection?.insertOne({
                                github_id: user_github_id,
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
}

const db_class = new db()

export default db_class
