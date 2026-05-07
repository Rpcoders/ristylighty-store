const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    "secretkey", // later move to .env
    { expiresIn: "7d" }
  );
};

module.exports = generateToken;