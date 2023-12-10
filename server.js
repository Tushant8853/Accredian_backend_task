const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'to-do-list'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.message);
    } else {
        console.log('Database connected.');
    }
});

app.post('/signup', (req, res) => { // Changed the endpoint to '/signup'
    const { name, email, pwd } = req.body; // Destructure the request body

    const sql = "INSERT INTO user_info (name, email, pwd) VALUES (?, ?, ?)";
    const values = [name, email, pwd];

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error('Error inserting data: ' + err.message);
            return res.status(500).json({ error: 'Error inserting data.' });
        }
        return res.json({ message: 'Data inserted successfully' });
    });
});

app.post('/login', (req, res) => {
    const { email, pwd } = req.body;
  
    const sql = "SELECT * FROM user_info WHERE email = ? AND pwd = ?";
    const values = [email, pwd];
  
    db.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error querying the database: ' + err.message);
        return res.status(500).json({ error: 'Error querying the database.' });
      }
  
      if (results.length > 0) {
        return res.json({ authenticated: true }); // User is authenticated
      } else {
        return res.json({ authenticated: false }); // User authentication failed
      }
    });
  });


app.listen(8086, () => {
    console.log("Server running on port 8086...");
});
