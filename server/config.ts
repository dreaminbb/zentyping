import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
                PORT: z.string().default('8000'),
                DB_URL: z.string().default('mongodb://localhost:27017'),
                PRODUCTION: z.boolean().default(false),
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