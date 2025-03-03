import type { Collection } from "mongoose";
import { MongoClient } from "mongodb";
import { config } from "../config";
import { type code_data } from "../interface";

class db {


                db: null | any
                python_code_collection: null | Collection<code_data>
                ts_code_collection: null | Collection<code_data>
                code_collection_obj: null | { [key: string]: Collection<code_data> | null }

                constructor() {
                                this.db = null
                                this.python_code_collection = null
                                this.ts_code_collection = null
                                this.code_collection_obj = null
                }

                async init(): Promise<void> {
                                await this.connect_db()
                                this.python_code_collection = await db_class.get_collection(config.PYTHON_COLLECTION_NAME as string)
                                this.ts_code_collection = await db_class.get_collection(config.TS_COLLECTION_NAME as string)
                                this.init_colletion_obj()
                }

                init_colletion_obj() {
                                this.code_collection_obj = {
                                                python: this.python_code_collection ?? null,
                                                ts: this.ts_code_collection ?? null
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
}

const db_class = new db()

export default db_class