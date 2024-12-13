// db.js
require('dotenv').config(); // Load environment variables from .env file
const mysql = require('mysql2');

// Create a MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost:3306', // Your MySQL server host (default localhost)
    user: process.env.DB_USER || 'root', // Your MySQL username
    password: process.env.DB_PASSWORD || 'odin34068770', // Your MySQL password
    database: process.env.DB_NAME || 'laptop_store' // Your database name
});

// Connect to the MySQL database
db.connect((err) => {
    if (err) {
        console.error('Could not connect to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

module.exports = db; // Export the connection