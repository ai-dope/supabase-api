import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { config } from './config/app.config';
import { errorHandler } from './middleware/error.middleware';
import { DatabaseRoute } from './presentation/route/database.route';

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Supabase API' });
});

// Supabase Route
const supabaseRoute = new DatabaseRoute();
app.use(`${config.api.prefix}/supabase`, supabaseRoute.getRouter());

// Swagger UI
app.use(config.swagger.path, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handling
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
  console.log(`Swagger UI available at http://localhost:${config.port}${config.swagger.path}`);
}); 