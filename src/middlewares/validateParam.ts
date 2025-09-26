import { NextFunction, Request, Response } from "express";

const validateIdParam = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "El parámetro 'id' es requerido.",
      data: null,
      errors: [
        {
          field: "params",
          message: "Debe enviar el id del usuario en la URL.",
        },
      ],
      meta: {
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
      },
    });
  }
  next();
};

export default validateIdParam;
