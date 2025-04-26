"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseRoute = void 0;
const express_1 = require("express");
const database_controller_1 = require("../controller/database.controller");
class DatabaseRoute {
    constructor() {
        this.router = (0, express_1.Router)();
        this.controller = new database_controller_1.DatabaseController();
        this.initializeRoute();
    }
    initializeRoute() {
        // Table Management Routes
        this.router.post('/tables', (req, res) => this.controller.createTable(req, res));
        this.router.delete('/tables/:tableName', (req, res) => this.controller.dropTable(req, res));
        this.router.get('/tables/:tableName/exists', (req, res) => this.controller.exists(req, res));
        // CRUD Routes
        this.router.post('/tables/:tableName/data', (req, res) => this.controller.upsert(req, res));
        this.router.get('/tables/:tableName/data', (req, res) => this.controller.query(req, res));
        this.router.delete('/tables/:tableName/data/:id', (req, res) => this.controller.delete(req, res));
    }
    getRouter() {
        return this.router;
    }
}
exports.DatabaseRoute = DatabaseRoute;
