import * as dotenv from "dotenv";
import * as path from "path";
import app from "./app";

const PORT = 3000;

const envFile = `.env.${process.env.NODE_ENV || "development"}`;

dotenv.config({
  path: path.resolve(__dirname, `../${envFile}`),
});

app.listen(PORT, () => {
  console.log("Usando entorno:", process.env.NODE_ENV);
  console.log("DATABASE_URL:", process.env.DATABASE_NAME);
  return console.log(`Express is listening at http://localhost:${PORT}`);
});
