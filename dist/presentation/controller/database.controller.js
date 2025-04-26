"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseController = void 0;
const database_repository_1 = require("../../infrastructure/repository/database.repository");
class DatabaseController {
    constructor() {
        this.repositories = new Map();
    }
    getRepository(tableName) {
        if (!this.repositories.has(tableName)) {
            this.repositories.set(tableName, new database_repository_1.DatabaseRepository(tableName));
        }
        return this.repositories.get(tableName);
    }
    // Table Management Operations
    async createTable(req, res) {
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
            const response = {
                success: true,
                data: { tableName }
            };
            res.status(201).json(response);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create table'
            });
        }
    }
    async dropTable(req, res) {
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
            const response = {
                success: true,
                data: { tableName }
            };
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to drop table'
            });
        }
    }
    // CRUD Operations
    async upsert(req, res) {
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
            const response = {
                success: true,
                data: result
            };
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update data'
            });
        }
    }
    async query(req, res) {
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
            const result = await repository.query(filter ? JSON.parse(filter) : undefined, pagination ? JSON.parse(pagination) : undefined);
            const response = {
                success: true,
                data: result
            };
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to query data'
            });
        }
    }
    async delete(req, res) {
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
            const response = {
                success: true,
                data: null
            };
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete data'
            });
        }
    }
    async exists(req, res) {
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
            const response = {
                success: true,
                data: { exists }
            };
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to check table existence'
            });
        }
    }
}
exports.DatabaseController = DatabaseController;
