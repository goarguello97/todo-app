import { Schema } from "express-validator";
import checkEmailExists from "../helpers/checkEmailExists";

const userCreate: Schema = {
  name: {
    notEmpty: { errorMessage: "El nombre es requerido." },
    isLength: {
      errorMessage: "Mínimo 3 caracteres y maximo 30 caracteres.",
      options: { min: 3, max: 30 },
    },
  },
  email: {
    notEmpty: { errorMessage: "El email es requerido." },
    isEmail: { errorMessage: "Ingrese un email válido." },
    custom: { options: checkEmailExists },
  },
  password: {
    matches: {
      errorMessage:
        "Mínimo 8 caracteres, una mayúscula, un número y un carácter especial.",
      options: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    },
  },
};

export default userCreate;
