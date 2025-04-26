import { Router } from 'express';
import { DatabaseController } from '../controller/database.controller';

export class DatabaseRoute {
    private router: Router;
    private controller: DatabaseController;

    constructor() {
        this.router = Router();
        this.controller = new DatabaseController();
        this.initializeRoute();
    }

    private initializeRoute(): void {
        // Table Management Routes
        this.router.post('/tables', (req, res) => this.controller.createTable(req, res));
        this.router.delete('/tables/:tableName', (req, res) => this.controller.dropTable(req, res));
        this.router.get('/tables/:tableName/exists', (req, res) => this.controller.exists(req, res));

        // CRUD Routes
        this.router.post('/tables/:tableName/data', (req, res) => this.controller.upsert(req, res));
        this.router.get('/tables/:tableName/data', (req, res) => this.controller.query(req, res));
        this.router.delete('/tables/:tableName/data/:id', (req, res) => this.controller.delete(req, res));
    }

    public getRouter(): Router {
        return this.router;
    }
} 