import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import router from "./routes/index.routes";

const app = express();
const PORT = 3000;

dotenv.config();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", router);

app.listen(PORT, () => {
  return console.log(`Express is listening at http://localhost:${PORT}`);
});

export default app;
