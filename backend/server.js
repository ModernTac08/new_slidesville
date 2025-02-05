const express = require('express');
const mysql = require('mysql2')
const cors = require('cors')
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});



app.get('/', (re, res)=> {
    return res.json("From Backend Side");
})

app.listen(8081, ()=> {
    console.log("listening");
})