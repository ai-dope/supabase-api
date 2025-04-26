import { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseRepository } from '../database.repository';
import { SupabaseClientFactory } from '../../factory/supabase.client.factory';

// Mock the Supabase client and factory
jest.mock('@supabase/supabase-js');
jest.mock('../../factory/supabase.client.factory');

describe('DatabaseRepository', () => {
    let repository: DatabaseRepository<any>;
    let mockSupabaseClient: jest.Mocked<SupabaseClient> & {
        from: jest.Mock;
        select: jest.Mock;
        insert: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
        eq: jest.Mock;
        single: jest.Mock;
        execute: jest.Mock;
    };
    let originalUrl: string | undefined;
    let originalKey: string | undefined;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Store original environment variables
        originalUrl = process.env.SUPABASE_URL;
        originalKey = process.env.SUPABASE_KEY;

        // Set up environment variables
        process.env.SUPABASE_URL = 'https://test.supabase.co';
        process.env.SUPABASE_KEY = 'test-key';

        mockSupabaseClient = {
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            update: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn(),
            execute: jest.fn(),
        } as jest.Mocked<SupabaseClient> & {
            from: jest.Mock;
            select: jest.Mock;
            insert: jest.Mock;
            update: jest.Mock;
            delete: jest.Mock;
            eq: jest.Mock;
            single: jest.Mock;
            execute: jest.Mock;
        };

        // Mock the factory's static getInstance and instance's getClient
        const mockFactory = {
            getClient: jest.fn().mockReturnValue(mockSupabaseClient)
        };
        (SupabaseClientFactory.getInstance as jest.Mock).mockReturnValue(mockFactory);

        // Create repository instance
        repository = new DatabaseRepository<any>('test_table');
    });

    afterEach(() => {
        // Restore original environment variables
        if (originalUrl !== undefined) {
            process.env.SUPABASE_URL = originalUrl;
        } else {
            delete process.env.SUPABASE_URL;
        }
        if (originalKey !== undefined) {
            process.env.SUPABASE_KEY = originalKey;
        } else {
            delete process.env.SUPABASE_KEY;
        }
    });

    describe('constructor', () => {
        it('should throw error when Supabase credentials are missing', () => {
            // Reset the factory mock
            (SupabaseClientFactory.getInstance as jest.Mock).mockImplementation(() => {
                throw new Error('Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_KEY environment variables.');
            });

            expect(() => new DatabaseRepository<any>('test_table')).toThrow('Missing Supabase credentials');
        });

        it('should initialize with valid credentials', () => {
            expect(SupabaseClientFactory.getInstance).toHaveBeenCalled();
            expect(repository).toBeInstanceOf(DatabaseRepository);
        });
    });

    describe('get', () => {
        it('should fetch data', async () => {
            const mockData = [{ id: 1, name: 'Test' }];
            mockSupabaseClient.select.mockResolvedValueOnce({ data: mockData, error: null });

            const result = await repository.get();

            expect(result).toEqual(mockData);
            expect(mockSupabaseClient.from).toHaveBeenCalledWith('test_table');
            expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
        });

        it('should handle errors', async () => {
            const mockError = new Error('Test error');
            mockSupabaseClient.select.mockResolvedValueOnce({ data: null, error: mockError });

            await expect(repository.get()).rejects.toThrow('Test error');
        });
    });

    describe('create', () => {
        it('should create a new record', async () => {
            const mockData = { id: 1, name: 'Test' };
            mockSupabaseClient.single.mockResolvedValueOnce({ data: mockData, error: null });

            const result = await repository.create(mockData);

            expect(result).toEqual(mockData);
            expect(mockSupabaseClient.from).toHaveBeenCalledWith('test_table');
            expect(mockSupabaseClient.insert).toHaveBeenCalledWith(mockData);
            expect(mockSupabaseClient.select).toHaveBeenCalled();
            expect(mockSupabaseClient.single).toHaveBeenCalled();
        });

        it('should handle errors', async () => {
            const mockError = new Error('Test error');
            mockSupabaseClient.single.mockResolvedValueOnce({ data: null, error: mockError });

            await expect(repository.create({ name: 'Test' })).rejects.toThrow('Test error');
        });
    });

    describe('patch', () => {
        it('should update a record', async () => {
            const mockData = { id: 1, name: 'Updated' };
            mockSupabaseClient.single.mockResolvedValueOnce({ data: mockData, error: null });

            const result = await repository.patch({ name: 'Updated' }, { id: 1 });

            expect(result).toEqual(mockData);
            expect(mockSupabaseClient.from).toHaveBeenCalledWith('test_table');
            expect(mockSupabaseClient.update).toHaveBeenCalledWith({ name: 'Updated' });
            expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', 1);
            expect(mockSupabaseClient.select).toHaveBeenCalled();
            expect(mockSupabaseClient.single).toHaveBeenCalled();
        });

        it('should handle errors', async () => {
            const mockError = new Error('Test error');
            mockSupabaseClient.single.mockResolvedValueOnce({ data: null, error: mockError });

            await expect(repository.patch({ name: 'Updated' }, { id: 1 })).rejects.toThrow('Test error');
        });
    });

    describe('delete', () => {
        it('should delete a record', async () => {
            const mockData = { id: 1 };
            mockSupabaseClient.eq.mockResolvedValueOnce({ data: null, error: null });

            const result = await repository.delete(mockData);

            expect(result).toBe(true);
            expect(mockSupabaseClient.from).toHaveBeenCalledWith('test_table');
            expect(mockSupabaseClient.delete).toHaveBeenCalled();
            expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', 1);
        });

        it('should handle errors', async () => {
            const mockError = new Error('Test error');
            mockSupabaseClient.eq.mockResolvedValueOnce({ data: null, error: mockError });

            await expect(repository.delete({ id: 1 })).rejects.toThrow('Test error');
        });
    });
}); 