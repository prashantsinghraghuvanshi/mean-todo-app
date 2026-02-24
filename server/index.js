const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoute");

const app = express();

app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT || 5001, () => {
  console.log("Server running on port 5001");
});