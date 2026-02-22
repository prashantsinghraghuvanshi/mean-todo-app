const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authRepo = require("../repositories/authRepository");

exports.registerUser = async (name, email, password) => {

  const existingUser = await authRepo.findUserByEmail(email);

  if (existingUser.rows.length > 0) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await authRepo.createUser(name, email, hashedPassword);

  const token = jwt.sign(
    { id: newUser.rows[0].id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { user: newUser.rows[0], token };
};

exports.loginUser = async (email, password) => {

  const userResult = await authRepo.findUserByEmail(email);

  if (userResult.rows.length === 0) {
    throw new Error("Invalid credentials");
  }

  const user = userResult.rows[0];

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    token
  };
};