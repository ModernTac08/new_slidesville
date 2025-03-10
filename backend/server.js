const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const { loginUser, registerUser, requestPasswordReset, resetPassword, saveFeaturedProduct, getFeaturedProducts, 
    saveInflatable, getInflatables, deleteInflatable, getAvailableInflatables, saveBooking, getUserBookings, 
    updateUserProfile, getUserProfile, cancelBooking } = require('./dbFiles/dbOperation');

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
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access Denied: No token provided' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid Token' });
    }
}




app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const result = await loginUser(email, password);

    if (result.success) {
        const token = jwt.sign(
            { id: result.id, email: result.email, role: result.role },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
        );

        return res.json({ success: true, token, id: result.id, email: result.email, role: result.role });
    } else {
        return res.json(result);
    }
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

  
/* This is for the Booking page */

app.post('/get-available-inflatables', async (req, res) => {
    const { startDate, endDate } = req.body;

    try {
        const availableInflatables = await getAvailableInflatables(startDate, endDate);
        res.json(availableInflatables);
    } catch (error) {
        console.error("Error getting available inflatables:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.post('/book-inflatable', authenticateToken, async (req, res) => {
    const { inflatableId, startDate, endDate } = req.body;
    const userId = req.user.id;

    if (!userId) {
        return res.status(401).json({ success: false, message: "User not authenticated." });
    }

    try {
        const result = await saveBooking(userId, inflatableId, startDate, endDate); 
        res.json(result);
    } catch (error) {
        console.error("Error booking inflatable:", error);
        res.status(500).json({ success: false, message: "Error booking inflatable." });
    }
});



/* This is for the User Dashboard stuff */

app.get('/user/bookings', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    if (!userId) {
        return res.status(401).json({ success: false, message: "User not authenticated." });
    }

    try {
        const bookings = await getUserBookings(userId);
        res.json(bookings);
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ success: false, message: "Error fetching bookings" });
    }
});


app.get('/user/profile', authenticateToken, async (req, res) => {
    const userId = parseInt(req.user.id, 10);

    if (isNaN(userId)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    try {
        const profile = await getUserProfile(userId);
        res.json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ success: false, message: "Error fetching profile" });
    }
});




app.put('/user/update-profile', authenticateToken, async (req, res) => {
    const { userId, email, firstName, lastName, phoneNumber } = req.body;

    if (!userId || isNaN(userId)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    try {
        const result = await updateUserProfile(userId, email, firstName, lastName, phoneNumber);
        res.json(result);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ success: false, message: "Error updating profile" });
    }
});





app.delete('/user/cancel-booking/:id', authenticateToken, async (req, res) => {
    const bookingId = parseInt(req.params.id, 10);
    const userId = parseInt(req.user.id, 10);

    if (isNaN(userId) || isNaN(bookingId)) {
        return res.status(400).json({ success: false, message: "Invalid userId or bookingId" });
    }

    try {
        const result = await cancelBooking(bookingId, userId);
        res.json(result);
    } catch (error) {
        console.error("Error canceling booking:", error);
        res.status(500).json({ success: false, message: "Error canceling booking" });
    }
});







app.listen(8081, () => {
    console.log("Server is running on port 8081...");
});
