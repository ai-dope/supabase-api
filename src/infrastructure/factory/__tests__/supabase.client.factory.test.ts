import { SupabaseClientFactory } from '../supabase.client.factory';
import { createClient } from '@supabase/supabase-js';

jest.mock('@supabase/supabase-js');

describe('SupabaseClientFactory', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset singleton instance
        (SupabaseClientFactory as any).instance = undefined;
        process.env.SUPABASE_URL = 'https://test.supabase.co';
        process.env.SUPABASE_KEY = 'test-key';
        (createClient as jest.Mock).mockReturnValue({});
    });

    afterEach(() => {
        delete process.env.SUPABASE_URL;
        delete process.env.SUPABASE_KEY;
        // Reset singleton instance
        (SupabaseClientFactory as any).instance = undefined;
    });

    it('should create a singleton instance', () => {
        const instance1 = SupabaseClientFactory.getInstance();
        const instance2 = SupabaseClientFactory.getInstance();

        expect(instance1).toBe(instance2);
    });

    it('should initialize with environment variables', () => {
        SupabaseClientFactory.getInstance();

        expect(createClient).toHaveBeenCalledWith(
            'https://test.supabase.co',
            'test-key',
            {
                auth: {
                    persistSession: false
                },
                db: {
                    schema: 'public'
                }
            }
        );
    });

    it('should throw error if SUPABASE_URL is missing', () => {
        delete process.env.SUPABASE_URL;
        // Reset instance to force new initialization
        (SupabaseClientFactory as any).instance = undefined;

        expect(() => SupabaseClientFactory.getInstance()).toThrow(
            'Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_KEY environment variables.'
        );
    });

    it('should throw error if SUPABASE_KEY is missing', () => {
        delete process.env.SUPABASE_KEY;
        // Reset instance to force new initialization
        (SupabaseClientFactory as any).instance = undefined;

        expect(() => SupabaseClientFactory.getInstance()).toThrow(
            'Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_KEY environment variables.'
        );
    });

    it('should return the same client instance', () => {
        const instance = SupabaseClientFactory.getInstance();
        const client1 = instance.getClient();
        const client2 = instance.getClient();

        expect(client1).toBe(client2);
    });
}); 