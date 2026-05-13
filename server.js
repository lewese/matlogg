const express = require("express");
const { Pool } = require("pg");
const app = express();

app.use(express.json());
app.use(express.static("public"));

// PostgreSQL Database Connection
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  port: process.env.DB_PORT || 5432,
});

app.get("/", (req, res) => {
  res.send("Matlogg API är igång!");
});

app.post("/meal", async (req, res) => {
  const { name, protein, carbs, fat } = req.body;

  const kcal = protein * 4 + carbs * 4 + fat * 9;

  try {
    const result = await pool.query(
      `INSERT INTO meals (name, protein, carbs, fat, kcal)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, protein, carbs, fat, kcal]
    );

    res.send({
      message: "Måltid sparad!",
      meal: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Databasfel");
  }
});

app.get("/meals", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM meals ORDER BY created_at DESC"
    );

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Databasfel");
  }
});

app.delete("/meal/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await pool.query(
      "DELETE FROM meals WHERE id = $1",
      [id]
    );

    res.send({ message: "Måltid raderad!" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Databasfel");
  }
});

app.listen(3000, () => console.log("Server kör på port 3000"));
