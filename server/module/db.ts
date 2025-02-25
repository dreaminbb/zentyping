import { config } from "../config";
import { MongoClient } from "mongodb";

export async function connect_db(): Promise<MongoClient | void> {
                try {
                                const client: MongoClient = new MongoClient(config.DB_URL, {});
                                await client.connect();
                                return client;
                } catch (e) {
                                console.error(e);
                                process.exit(1);
                }
}