import { Request, Response } from 'express';
import { DatabaseController } from '../database.controller';
import { DatabaseRepository } from '../../../infrastructure/repositories/database.repository';

jest.mock('../../../infrastructure/repositories/database.repository');

describe('SupabaseController', () => {
    let controller: DatabaseController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockRepository: jest.Mocked<DatabaseRepository<any>>;

    beforeEach(() => {
        mockRepository = {
            create: jest.fn(),
            get: jest.fn(),
            patch: jest.fn(),
            delete: jest.fn(),
            query: jest.fn(),
            exists: jest.fn(),
            count: jest.fn(),
            upsert: jest.fn(),
            createTable: jest.fn().mockResolvedValue(undefined),
            dropTable: jest.fn().mockResolvedValue(undefined)
        } as any;

        (DatabaseRepository as jest.Mock).mockImplementation(() => mockRepository);
        
        controller = new DatabaseController();
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('createTable', () => {
        it('should create a table successfully', async () => {
            mockRequest.body = {
                tableName: 'test_table',
                schema: {
                    name: 'test_table',
                    columns: [
                        { name: 'id', type: 'uuid', constraints: ['PRIMARY KEY'] },
                        { name: 'name', type: 'text' }
                    ]
                }
            };

            await controller.createTable(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: { tableName: 'test_table' }
            });
        });

        it('should return 400 if tableName or schema is missing', async () => {
            mockRequest.body = {};

            await controller.createTable(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: 'Table name and schema are required'
            });
        });
    });

    describe('dropTable', () => {
        it('should drop a table successfully', async () => {
            mockRequest.params = { tableName: 'test_table' };

            await controller.dropTable(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: { tableName: 'test_table' }
            });
        });

        it('should return 400 if tableName is missing', async () => {
            mockRequest.params = {};

            await controller.dropTable(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: 'Table name is required'
            });
        });
    });

    describe('upsert', () => {
        it('should upsert data successfully', async () => {
            const testData = { id: '123', name: 'Test' };
            mockRequest.params = { tableName: 'test_table' };
            mockRequest.body = testData;
            mockRepository.upsert.mockResolvedValue(testData);

            await controller.upsert(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: testData
            });
        });

        it('should return 400 if tableName or data is missing', async () => {
            mockRequest.params = {};
            mockRequest.body = {};

            await controller.upsert(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: 'Table name and data are required'
            });
        });
    });

    describe('query', () => {
        it('should query data successfully', async () => {
            const testData = [{ id: '123', name: 'Test' }];
            mockRequest.params = { tableName: 'test_table' };
            mockRequest.query = {
                filter: JSON.stringify({ name: 'Test' }),
                pagination: JSON.stringify({ limit: 10, offset: 0 })
            };
            mockRepository.query.mockResolvedValue(testData);

            await controller.query(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: testData
            });
        });

        it('should return 400 if tableName is missing', async () => {
            mockRequest.params = {};
            mockRequest.query = {};

            await controller.query(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: 'Table name is required'
            });
        });
    });

    describe('delete', () => {
        it('should delete data successfully', async () => {
            mockRequest.params = { tableName: 'test_table', id: '123' };
            mockRepository.delete.mockResolvedValue(true);

            await controller.delete(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: null
            });
        });

        it('should return 400 if tableName or id is missing', async () => {
            mockRequest.params = {};

            await controller.delete(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: 'Table name and ID are required'
            });
        });
    });

    describe('exists', () => {
        it('should check table existence successfully', async () => {
            mockRequest.params = { tableName: 'test_table' };
            mockRepository.exists.mockResolvedValue(true);

            await controller.exists(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: { exists: true }
            });
        });

        it('should return 400 if tableName is missing', async () => {
            mockRequest.params = {};

            await controller.exists(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                error: 'Table name is required'
            });
        });
    });
}); 