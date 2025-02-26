const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { loginUser, registerUser, requestPasswordReset, resetPassword } = require('./dbFiles/dbOperation');
require('dotenv').config();


const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
}));


function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid Token' });
    }
}


function authorizeAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admins Only' });
    }
    next();
}



app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const result = await loginUser(email, password);

    if (result.success) {
        const token = jwt.sign(
            { email, role: result.role },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
        );

        return res.json({ success: true, token, role: result.role });
    } else {
        return res.json(result);
    }
});

app.get('/admin-data', authenticateToken, authorizeAdmin, (req, res) => {
    res.json({ message: "Successfully Logged in as Admin!" });
});


app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const result = await registerUser(email, password);
    res.json(result);
});

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const result = await requestPasswordReset(email);
    res.json(result);
});

app.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    const result = await resetPassword(token, newPassword);
    res.json(result);
});





let featuredProducts = [
    { id: 1, image: '', description: '' },
    { id: 2, image: '', description: '' },
    { id: 3, image: '', description: '' },
  ];

  app.post('/save-featured-products', (req, res) => {
      featuredProducts = req.body.products;
      res.json({ message: 'Featured products saved successfully!' });
  });
  
  app.get('/get-featured-products', (req, res) => {
      res.json(featuredProducts);
  });














app.listen(8081, () => {
    console.log("Server is running on port 8081...");
});
