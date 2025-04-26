"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseClientFactory = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
class SupabaseClientFactory {
    constructor() {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_KEY;
        if (!url || !key) {
            throw new Error('Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_KEY environment variables.');
        }
        this.client = (0, supabase_js_1.createClient)(url, key, {
            auth: {
                persistSession: false // We don't need session persistence for server-side operations
            },
            db: {
                schema: 'public' // Default schema
            }
        });
    }
    static getInstance() {
        if (!SupabaseClientFactory.instance) {
            SupabaseClientFactory.instance = new SupabaseClientFactory();
        }
        return SupabaseClientFactory.instance;
    }
    getClient() {
        return this.client;
    }
}
exports.SupabaseClientFactory = SupabaseClientFactory;
