import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();


const envSchema = z.object({
                port: z.string().default('8000'),
                db_url: z.string().default('mongodb://localhost:27017'),
                production: z.boolean().default(false),
});


const get_config = () => {
                try {
                                const config = envSchema.parse(process.env);
                                return config;
                } catch (error) {
                                console.error('❌ Invalid environment variables:', error);
                                throw new Error('Invalid environment variables');
                }
}

export const config = get_config() as z.infer<typeof envSchema> ? get_config() as z.infer<typeof envSchema> : process.exit(1);


// define type

export interface code_data {
                _id?:string,
                id: number,
                code: string,
                lang:string,
}