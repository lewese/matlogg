const express = require("express");
const mealsRouter = require("./routes/meals");

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(mealsRouter);

module.exports = app;
