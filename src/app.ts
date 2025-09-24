import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import clearDatabase from "./db/clearDatabase";
import router from "./routes/index.routes";
import swaggerSpec from "./swagger";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  clearDatabase();
}

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", router);

export default app;
