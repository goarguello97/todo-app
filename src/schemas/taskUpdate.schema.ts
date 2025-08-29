import { Schema } from "express-validator";

const taskUpdate: Schema = {
  task: {
    optional: true,
    notEmpty: { errorMessage: "La tarea es requerida." },
    isLength: {
      errorMessage: "Mínimo 10 caracteres y maximo 100 caracteres.",
      options: { min: 10, max: 100 },
    },
  },
  userId: {
    optional: true,
    notEmpty: { errorMessage: "Ingrese un ID de usuario válido." },
  },
};

export default taskUpdate;
