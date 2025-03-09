import { Collection, MongoClient } from 'mongodb';
import python_code_data from './python.json'
import ts_code_data from './ts.json'
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
                                const python_collection = database.collection(config.PYTHON_COLLECTION_NAME) ? database.collection(config.PYTHON_COLLECTION_NAME) : function () { throw new Error('Collection not found') }();
                                const ts_collection = database.collection(config.TS_COLLECTION_NAME) ? database.collection(config.TS_COLLECTION_NAME) : function () { throw new Error('Collection not found') }();

                                if (ts_code_data.length === python_code_data.length) {
                                                throw new Error('data length not equal')
                                }
                                
                                const length = ts_code_data.length > python_code_data.length ? ts_code_data.length : python_code_data.length;

                                for (let i = 0; i < length; i++) {
                                                try {

                                                                if (ts_code_data[i]) {
                                                                                await ts_collection.insertOne(ts_code_data[i]);
                                                                }
                                                                if (python_code_data[i]) {
                                                                                await python_collection.insertOne(python_code_data[i])
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