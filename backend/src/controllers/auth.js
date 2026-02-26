const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");
const conn = db.promise();

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check existing user
    const [exists] = await conn.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (exists.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // hash password
    const hash = await bcrypt.hash(password, 10);

    // insert user
    const [result] = await conn.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hash]
    );

    // generate token
    const token = jwt.sign(
      { id: result.insertId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({ token });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario por email
    const [rows] = await conn.query(
      "SELECT id, email, password FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Login failed: Invalid credentials"
      });
    }

    const user = rows[0];

    // Comparar password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({
        success: false,
        message: "Login failed: Invalid credentials"
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Respuesta clara para el frontend
    return res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email
      },
      token
    });

  } catch (err) {
    console.error("Auth login error:", err);
    return res.status(500).json({
      success: false,

      message: "Server error"
    });
  }
};
