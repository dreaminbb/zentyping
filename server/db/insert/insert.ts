import { Collection, MongoClient } from 'mongodb';
import python_code_data from './python.json'
import ts_code_data from './ts.json'

type codeData = {
                id: number,
                lang: string,
                url: string,
                code: string,
}

const uri = 'http://localhost:27017';
const client = new MongoClient(uri);


async function run() {
                try {
                                await client.connect();
                                const database = client.db('zentyping') ? client.db('zentyping') : function () { throw new Error('Database not found') }();
                                const python_collection = database.collection('python_code') ? database.collection('python_code') : function () { throw new Error('Collection not found') }();
                                const ts_collection = database.collection('ts_code') ? database.collection('ts_code') : function () { throw new Error('Collection not found') }();

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