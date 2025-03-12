import { Collection, MongoClient } from 'mongodb';
import rust_code from './rust.json';
import { config } from '../../config';

type codeData = {
                id: number,
                lang: string,
                url: string,
                code: string,
}
;
const client = new MongoClient(config.DB_URL);


async function run() {
                try {
                                await client.connect();
                                 const database = client.db(config.DB_NAME) ? client.db(config.DB_NAME) : function () { throw new Error('Database not found') }();
                                const rust_collection = database.collection(config.RUST_COLLECTION_NAME) ? database.collection(config.RUST_COLLECTION_NAME) : function () { throw new Error('Collection not found') }();
                                
                                const length = rust_code.length 

                                for (let i = 0; i < length; i++) {
                                                try {

                                                                if (rust_code[i]) {
                                                                                await rust_collection.insertOne(rust_code[i]);
                                                                }
                                                } catch (e) {
                                                                console.error(e)
                                                                return
                                       }
                                }

                } finally {
                                await client.close();
                }
}

run().catch(console.dir);
