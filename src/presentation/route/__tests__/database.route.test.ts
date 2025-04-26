import { DatabaseRoute } from '../database.route';
import { DatabaseController } from '../../controller/database.controller';

jest.mock('../../controller/database.controller');

describe('DatabaseRoute', () => {
    let route: DatabaseRoute;
    let mockController: jest.Mocked<DatabaseController>;

    beforeEach(() => {
        mockController = new DatabaseController() as jest.Mocked<DatabaseController>;
        (DatabaseController as jest.Mock).mockImplementation(() => mockController);
        route = new DatabaseRoute();
    });

    it('should initialize route', () => {
        const router = route.getRouter();
        const routeList = router.stack.map(layer => ({
            path: layer.route?.path,
            method: layer.route?.stack[0].method
        }));

        expect(routeList).toContainEqual({
            path: '/tables',
            method: 'post'
        });

        expect(routeList).toContainEqual({
            path: '/tables/:tableName',
            method: 'delete'
        });

        expect(routeList).toContainEqual({
            path: '/tables/:tableName/exists',
            method: 'get'
        });

        expect(routeList).toContainEqual({
            path: '/tables/:tableName/data',
            method: 'post'
        });

        expect(routeList).toContainEqual({
            path: '/tables/:tableName/data',
            method: 'get'
        });

        expect(routeList).toContainEqual({
            path: '/tables/:tableName/data/:id',
            method: 'delete'
        });
    });

    it('should delegate createTable to controller', () => {
        const router = route.getRouter();
        const routeEntry = router.stack.find(layer => 
            layer.route?.path === '/tables' && 
            layer.route?.stack[0].method === 'post'
        );

        expect(routeEntry).toBeDefined();
        expect(mockController.createTable).toBeDefined();
    });

    it('should delegate dropTable to controller', () => {
        const router = route.getRouter();
        const routeEntry = router.stack.find(layer => 
            layer.route?.path === '/tables/:tableName' && 
            layer.route?.stack[0].method === 'delete'
        );

        expect(routeEntry).toBeDefined();
        expect(mockController.dropTable).toBeDefined();
    });

    it('should delegate exists to controller', () => {
        const router = route.getRouter();
        const routeEntry = router.stack.find(layer => 
            layer.route?.path === '/tables/:tableName/exists' && 
            layer.route?.stack[0].method === 'get'
        );

        expect(routeEntry).toBeDefined();
        expect(mockController.exists).toBeDefined();
    });

    it('should delegate upsert to controller', () => {
        const router = route.getRouter();
        const routeEntry = router.stack.find(layer => 
            layer.route?.path === '/tables/:tableName/data' && 
            layer.route?.stack[0].method === 'post'
        );

        expect(routeEntry).toBeDefined();
        expect(mockController.upsert).toBeDefined();
    });

    it('should delegate query to controller', () => {
        const router = route.getRouter();
        const routeEntry = router.stack.find(layer => 
            layer.route?.path === '/tables/:tableName/data' && 
            layer.route?.stack[0].method === 'get'
        );

        expect(routeEntry).toBeDefined();
        expect(mockController.query).toBeDefined();
    });

    it('should delegate delete to controller', () => {
        const router = route.getRouter();
        const routeEntry = router.stack.find(layer => 
            layer.route?.path === '/tables/:tableName/data/:id' && 
            layer.route?.stack[0].method === 'delete'
        );

        expect(routeEntry).toBeDefined();
        expect(mockController.delete).toBeDefined();
    });
}); 