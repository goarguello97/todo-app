import { Schema } from "express-validator";

const taskCreate: Schema = {
  task: {
    notEmpty: { errorMessage: "La tarea es requerida." },
    isLength: {
      errorMessage: "Mínimo 10 caracteres y maximo 100 caracteres.",
      options: { min: 10, max: 100 },
    },
  },
  userId: {
    notEmpty: { errorMessage: "Ingrese un ID de usuario válido." },
  },
};

export default taskCreate;
