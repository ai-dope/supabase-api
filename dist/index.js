"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const path_1 = __importDefault(require("path"));
const app_config_1 = require("./config/app.config");
const error_middleware_1 = require("./middleware/error.middleware");
const database_route_1 = require("./presentation/route/database.route");
const app = (0, express_1.default)();
const swaggerDocument = yamljs_1.default.load(path_1.default.join(__dirname, '../swagger.yaml'));
// Middleware
app.use(express_1.default.json());
// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Supabase API' });
});
// Supabase Route
const supabaseRoute = new database_route_1.DatabaseRoute();
app.use(`${app_config_1.config.api.prefix}/supabase`, supabaseRoute.getRouter());
// Swagger UI
app.use(app_config_1.config.swagger.path, swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// Error handling
app.use(error_middleware_1.errorHandler);
// Start server
app.listen(app_config_1.config.port, () => {
    console.log(`Server is running on port ${app_config_1.config.port}`);
    console.log(`Swagger UI available at http://localhost:${app_config_1.config.port}${app_config_1.config.swagger.path}`);
});
