const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authService = require("../services/authService");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const result = await authService.registerUser(name, email, password);

    res.status(201).json({
      message: "User registered",
      ...result
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);

    res.status(200).json({
      message: "Login successful",
      ...result
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};