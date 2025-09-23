import { NextFunction, Request, Response } from "express";
import { FieldValidationError, validationResult } from "express-validator";

const validateFields = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorResponse = {
      success: false,
      message: "Error de validación.",
      data: null,
      errors: errors.array().map((err: FieldValidationError) => {
        return { field: err.path, message: err.msg };
      }),
      meta: {
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    };
    return res.status(400).json(errorResponse);
  }
  next();
};

export default validateFields;
