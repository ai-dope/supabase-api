import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/apiResponse';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  
  const response: ApiResponse<null> = {
    success: false,
    error: err.message || 'Internal Server Error',
  };

  res.status(500).json(response);
}; 