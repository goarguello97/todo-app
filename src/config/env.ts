import path from "path";

// Detecta qué archivo .env cargar
export const envPath = path.resolve(
  process.cwd(),
  process.env.NODE_ENV === "test" ? ".env.test" : ".env"
);
