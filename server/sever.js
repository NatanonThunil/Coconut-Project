const express = require('express');
const mysql = require('mysql2');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Set up MySQL connection
const db = mysql.createConnection({
  host: '127.0.0.1:3306',    // Change to your MySQL host
  user: 'root',         // Your MySQL username
  password: 'asd123asd',         // Your MySQL password
  database: 'Coconut' // Your MySQL database name
});

// Test the database connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Example API endpoint
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Database query error');
    } else {
      res.json(results);
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
