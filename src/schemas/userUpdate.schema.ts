import { Schema } from "express-validator";

const userUpdate: Schema = {
  name: {
    optional: true,
    isLength: {
      errorMessage: "Mínimo 3 caracteres y maximo 30 caracteres.",
      options: { min: 3, max: 30 },
    },
  },
  email: {
    optional: true,
    /*isEmail: { errorMessage: "Ingrese un email válido." },*/
  },
};

export default userUpdate;
