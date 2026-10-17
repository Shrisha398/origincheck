const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "host.docker.internal",
    user: "root",
    password: "",
    database: "auth_db",
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("MySQL connected successfully!");
        connection.release();
    } catch (error) {
        console.error("MySQL connection failed:", error.message);
    }
}

testConnection();

module.exports = pool;