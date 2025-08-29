import { Schema } from "express-validator";

const passwordUpdate: Schema = {
  currentPassword: {
    notEmpty: { errorMessage: "La contraseña actual es requerida." },
  },
  newPassword: {
    notEmpty: { errorMessage: "La nueva contraseña es requerida." },
    matches: {
      errorMessage:
        "Mínimo 8 caracteres, una mayúscula, un número y un carácter especial.",
      options: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    },
  },
};

export default passwordUpdate;
