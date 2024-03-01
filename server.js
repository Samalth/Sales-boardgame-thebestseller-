const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

// MySQL Connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "thebestseller"
});
connection.connect();

// Define a route to fetch data
app.get('/api/questionstable', (req, res) => {
    const query = 'SELECT QDanish FROM questionstable LIMIT 2';

    // Execute the query
    connection.query(query, (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});