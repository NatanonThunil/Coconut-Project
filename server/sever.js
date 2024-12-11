const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Enable CORS for API requests
const app = express();

// Middleware to parse JSON and handle CORS
app.use(express.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'asd123asd',
  database: 'Coconut',
  port: 3306
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// API endpoint to fetch news data
app.get('/api/news_table', (req, res) => {
  db.query('SELECT news_id, image, author, upload_date, description, summerize, hot_new FROM news_table', (err, results) => {
    if (err) {
      console.error('Error fetching news_table data:', err);
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
