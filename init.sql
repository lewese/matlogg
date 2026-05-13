-- Initialize meals table for matlogg application
CREATE TABLE IF NOT EXISTS meals (
  id SERIAL PRIMARY KEY,
  name TEXT,
  protein INT,
  carbs INT,
  fat INT,
  kcal INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
