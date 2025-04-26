export const config = {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development',
  api: {
    prefix: '/api/v1',
  },
  swagger: {
    path: '/api-docs',
  },
}; 