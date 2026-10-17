const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


// TEST SERVER
app.get("/", (req, res) => {
    res.json({
        message: "OriginCheck server is working"
    });
});


// ==============================
// REGISTER
// ==============================

app.post("/api/auth/register", async (req, res) => {
    try {
        const {
            fullName,
            email,
            organization,
            role,
            password
        } = req.body;

        console.log("Register request received:", req.body);

        // Check required fields
        if (!fullName || !email || !password || !role) {
            return res.status(400).json({
                message: "Please fill all required fields."
            });
        }

        // Create username from email
        const username = email.split("@")[0];

        // Check whether email or username already exists
        const [existingUsers] = await pool.query(
            "SELECT * FROM users WHERE email = ? OR username = ?",
            [email, username]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                message: "Email or username already exists."
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert user
        const [result] = await pool.query(
            `INSERT INTO users
            (fullName, username, email, organization, password_hash, role)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                fullName,
                username,
                email,
                organization || "",
                passwordHash,
                role
            ]
        );

        console.log("User registered:", result.insertId);

        // Send user data back
        res.status(201).json({
            message: "Registration successful",
            user: {
                id: result.insertId,
                fullName: fullName,
                username: username,
                email: email,
                organization: organization || "",
                role: role
            }
        });

    } catch (error) {

        console.error("REGISTER ERROR:", error);

        res.status(500).json({
            message: "Server error. Please try again later."
        });
    }
});


// ==============================
// LOGIN
// ==============================

app.post("/api/auth/login", async (req, res) => {
    try {

        const {
            identifier,
            password
        } = req.body;

        console.log("Login request received:", identifier);

        if (!identifier || !password) {
            return res.status(400).json({
                message: "Username/email and password are required."
            });
        }

        // Find user by email OR username
        const [users] = await pool.query(
            `SELECT *
             FROM users
             WHERE email = ? OR username = ?`,
            [identifier, identifier]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid email/username or password."
            });
        }

        const user = users[0];

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email/username or password."
            });
        }

        console.log("Login successful:", user.email);

        // Send user information to React
        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                fullName: user.fullName,
                username: user.username,
                email: user.email,
                organization: user.organization,
                role: user.role
            }
        });

    } catch (error) {

        console.error("LOGIN ERROR:", error);

        res.status(500).json({
            message: "Server error. Please try again later."
        });
    }
});


// ==============================
// START SERVER
// ==============================

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`OriginCheck server running on http://localhost:${PORT}`);
});