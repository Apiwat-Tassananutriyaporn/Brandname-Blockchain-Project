require("dotenv").config();

const cors = require("cors");
const express = require("express");

const initMySQL = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes");
const productRoutes = require("./src/routes/product.routes");

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  }),
);

const port = process.env.PORT || 8000

let conn;

app.use((req, res, next) => {
  req.db = conn;
  next();
});


app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);

app.listen(port, async (req,res) => {
  conn =await initMySQL() // เรียกจาก db.js
  console.log(`http server run at : http://localhost:${port}`)
})