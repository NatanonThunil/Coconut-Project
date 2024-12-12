const express = require('express');
const cors = require('cors');
const newsApi = require('./api/news_table'); // Import the new API file

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Use the newsApi router
app.use('/api/news_table', newsApi)
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
