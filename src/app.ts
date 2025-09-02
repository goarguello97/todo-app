import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { envPath } from "./config/env";
import router from "./routes/index.routes";

const app = express();

dotenv.config({ path: envPath });
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", router);

export default app;
