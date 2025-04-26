// Global test setup
process.env.NODE_ENV = 'test';

// Increase timeout for all tests
jest.setTimeout(30000);

// Mock environment variables
process.env.SUPABASE_URL = 'https://mock-supabase-url.com';
process.env.SUPABASE_KEY = 'mock-supabase-key';
process.env.SUPABASE_SERVICE_KEY = 'mock-supabase-service-key'; 