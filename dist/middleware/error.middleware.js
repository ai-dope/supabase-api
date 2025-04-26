"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const response = {
        success: false,
        error: err.message || 'Internal Server Error',
    };
    res.status(500).json(response);
};
exports.errorHandler = errorHandler;
