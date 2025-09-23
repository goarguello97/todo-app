import { Response } from "express";

export const successResponse = <T>(
  res: Response,
  data: T,
  message: string,
  status = 200,
  total?: number
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    errors: null,
    meta: {
      timestam: new Date().toISOString(),
      path: res.req.originalUrl,
      total,
    },
  });
};

export const errorResponse = (
  res: Response,
  message: string,
  errors: { field?: string; message: string }[] | null = null,
  status = 400,
  data: any = null
) => {
  return res.status(status).json({
    success: false,
    message,
    data,
    errors,
    meta: {
      timestamp: new Date().toISOString(),
      path: res.req.originalUrl,
    },
  });
};
