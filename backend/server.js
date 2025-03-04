const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const { loginUser, registerUser, requestPasswordReset, resetPassword, saveFeaturedProduct, getFeaturedProducts, saveInflatable, getInflatables, deleteInflatable } = require('./dbFiles/dbOperation');
require('dotenv').config();


const app = express();
app.use(express.json());
app.options('*', cors());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });




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


/* This is for the Featured Products section */

app.post('/save-featured-products', upload.single('image'), async (req, res) => {
    console.log("Received File:", req.file);
    console.log("Received Body:", req.body);

    const { id, description } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await saveFeaturedProduct(id, description, imagePath);
    res.json({ success: true, imagePath });
});

app.get('/get-featured-products', async (req, res) => {
    const products = await getFeaturedProducts();
    res.json(products);
});


/* This is for the Inflatables page */

app.post('/save-inflatable', upload.single('image'), async (req, res) => {
    console.log("Received File:", req.file);
    console.log("Received Body:", req.body);

    let { id, name, price, existingImagePath } = req.body;
    let imagePath = req.file ? `/uploads/${req.file.filename}` : existingImagePath;

    id = id === 'null' || id === '' ? null : parseInt(id, 10);

    if (isNaN(price)) {
        return res.status(400).json({ success: false, message: "Invalid price format" });
    }

    const result = await saveInflatable(id, name, price, imagePath);
    res.json({ success: true, id: result.id, imagePath: imagePath });
});

app.get('/get-inflatables', async (req, res) => {
    const inflatables = await getInflatables();
    res.json(inflatables);
});


app.delete('/delete-inflatable/:id', async (req, res) => {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid ID provided" });
    }

    try {
        const result = await deleteInflatable(id);
        res.json(result);
    } catch (error) {
        console.error("Error deleting inflatable:", error);
        res.status(500).json({ success: false, message: "Server error while deleting inflatable" });
    }
});

  












app.listen(8081, () => {
    console.log("Server is running on port 8081...");
});
