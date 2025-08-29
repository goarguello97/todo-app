import { Schema } from "express-validator";

const userLogin: Schema = {
  email: { notEmpty: { errorMessage: "El email es requerido." } },
  password: { notEmpty: { errorMessage: "La contraseña es requerida." } },
};

export default userLogin;
