const express = require("express");
const router = express.Router();
const pool = require("../db");

function calcKcal(protein, carbs, fat) {
  return protein * 4 + carbs * 4 + fat * 9;
}

router.post("/meal", async (req, res) => {
  const { name, protein, carbs, fat } = req.body;

  if (!name || protein == null || carbs == null || fat == null) {
    return res.status(400).send("Fält saknas");
  }

  const kcal = calcKcal(Number(protein), Number(carbs), Number(fat));

  try {
    const result = await pool.query(
      `INSERT INTO meals (name, protein, carbs, fat, kcal)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, protein, carbs, fat, kcal]
    );
    res.send({ message: "Måltid sparad!", meal: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send("Databasfel");
  }
});

router.get("/meals", async (req, res) => {
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

router.delete("/meal/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    await pool.query("DELETE FROM meals WHERE id = $1", [id]);
    res.send({ message: "Måltid raderad!" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Databasfel");
  }
});

module.exports = router;
