import dotenv from "dotenv";
import path from "path";

// Detecta qué archivo .env cargar
const envPath = path.resolve(
  process.cwd(),
  process.env.NODE_ENV === "test" ? ".env.test" : ".env"
);

dotenv.config({ path: envPath });

console.log("Connected to DB:", process.env.DATABASE_URL);
