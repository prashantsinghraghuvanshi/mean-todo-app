const express = require("express");
const cors = require("cors");
require("dotenv").config();


const authRoutes = require("./routes/authRoute");
const todoRoutes = require("./routes/todoRoute");

const app = express();

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
  }));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

app.listen(process.env.PORT || 5001, () => {
  console.log("Server running on port 5001");
});