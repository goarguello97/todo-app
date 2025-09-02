import app from "./app";

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Connected to DB:", process.env.DATABASE_URL);
  return console.log(`Express is listening at http://localhost:${PORT}`);
});
