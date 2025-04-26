"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development',
    api: {
        prefix: '/api/v1',
    },
    swagger: {
        path: '/api-docs',
    },
};
