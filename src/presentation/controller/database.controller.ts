import { Request, Response } from 'express';
import { DatabaseRepository } from '../../infrastructure/repository/database.repository';
import { ApiResponse } from '../../domain/type/apiResponse';

export class DatabaseController {
    private repositories: Map<string, DatabaseRepository<any>> = new Map();

    private getRepository(tableName: string): DatabaseRepository<any> {
        if (!this.repositories.has(tableName)) {
            this.repositories.set(tableName, new DatabaseRepository<any>(tableName));
        }
        return this.repositories.get(tableName)!;
    }

    // Table Management Operations
    async createTable(req: Request, res: Response): Promise<void> {
        try {
            const { tableName, schema } = req.body;
            
            if (!tableName || !schema) {
                res.status(400).json({
                    success: false,
                    error: 'Table name and schema are required'
                });
                return;
            }

            const repository = this.getRepository(tableName);
            await repository.createTable(schema);

            const response: ApiResponse<{ tableName: string }> = {
                success: true,
                data: { tableName }
            };

            res.status(201).json(response);
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create table'
            });
        }
    }

    async dropTable(req: Request, res: Response): Promise<void> {
        try {
            const { tableName } = req.params;
            
            if (!tableName) {
                res.status(400).json({
                    success: false,
                    error: 'Table name is required'
                });
                return;
            }

            const repository = this.getRepository(tableName);
            await repository.dropTable();
            this.repositories.delete(tableName);

            const response: ApiResponse<{ tableName: string }> = {
                success: true,
                data: { tableName }
            };

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to drop table'
            });
        }
    }

    // CRUD Operations
    async upsert(req: Request, res: Response): Promise<void> {
        try {
            const { tableName } = req.params;
            const data = req.body;

            if (!tableName || !data) {
                res.status(400).json({
                    success: false,
                    error: 'Table name and data are required'
                });
                return;
            }

            const repository = this.getRepository(tableName);
            const result = await repository.upsert(data);

            const response: ApiResponse<any> = {
                success: true,
                data: result
            };

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update data'
            });
        }
    }

    async query(req: Request, res: Response): Promise<void> {
        try {
            const { tableName } = req.params;
            const { filter, pagination } = req.query;

            if (!tableName) {
                res.status(400).json({
                    success: false,
                    error: 'Table name is required'
                });
                return;
            }

            const repository = this.getRepository(tableName);
            const result = await repository.query(
                filter ? JSON.parse(filter as string) : undefined,
                pagination ? JSON.parse(pagination as string) : undefined
            );

            const response: ApiResponse<any> = {
                success: true,
                data: result
            };

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to query data'
            });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { tableName, id } = req.params;

            if (!tableName || !id) {
                res.status(400).json({
                    success: false,
                    error: 'Table name and ID are required'
                });
                return;
            }

            const repository = this.getRepository(tableName);
            await repository.delete({ id });

            const response: ApiResponse<null> = {
                success: true,
                data: null
            };

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete data'
            });
        }
    }

    async exists(req: Request, res: Response): Promise<void> {
        try {
            const { tableName } = req.params;
            
            if (!tableName) {
                res.status(400).json({
                    success: false,
                    error: 'Table name is required'
                });
                return;
            }

            const repository = this.getRepository(tableName);
            const exists = await repository.exists({});

            const response: ApiResponse<{ exists: boolean }> = {
                success: true,
                data: { exists }
            };

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to check table existence'
            });
        }
    }
} 