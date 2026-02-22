const pool = require("../config/db");

exports.findUserByEmail = async (email) => {
  return await pool.query("SELECT * FROM users WHERE email = $1", [email]);
};

exports.createUser = async (name, email, password) => {
  return await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1,$2,$3) RETURNING id,name,email",
    [name, email, password]
  );
};