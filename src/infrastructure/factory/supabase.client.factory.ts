import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class SupabaseClientFactory {
    private static instance: SupabaseClientFactory;
    private client: SupabaseClient;

    private constructor() {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_KEY;

        if (!url || !key) {
            throw new Error('Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_KEY environment variables.');
        }

        this.client = createClient(url, key, {
            auth: {
                persistSession: false // We don't need session persistence for server-side operations
            },
            db: {
                schema: 'public' // Default schema
            }
        });
    }

    public static getInstance() : SupabaseClientFactory {
        if (!SupabaseClientFactory.instance) {
            SupabaseClientFactory.instance = new SupabaseClientFactory();
        }
        return SupabaseClientFactory.instance;
    }

    public getClient(): SupabaseClient {
        return this.client;
    }
} 