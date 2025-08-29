import { Schema } from "express-validator";
import checkEmailExists from "../helpers/checkEmailExists";

const userUpdate: Schema = {
  name: {
    optional: true,
    notEmpty: { errorMessage: "El nombre es requerido." },
    isLength: {
      errorMessage: "Mínimo 3 caracteres y maximo 30 caracteres.",
      options: { min: 3, max: 30 },
    },
  },
  email: {
    optional: true,
    notEmpty: { errorMessage: "El email es requerido." },
    isEmail: { errorMessage: "Ingrese un email válido." },
    custom: { options: checkEmailExists },
  },
};

export default userUpdate;
