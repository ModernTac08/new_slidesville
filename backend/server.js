const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const { loginUser, registerUser, requestPasswordReset, resetPassword, saveFeaturedProduct, getFeaturedProducts, 
    saveInflatable, getInflatables, deleteInflatable, getAvailableInflatables, saveBooking, getUserBookings, 
    updateUserProfile, getUserProfile, cancelBooking, getUsers, updateUserRole, deleteUser, getUserRentals, 
    updateRentalStatus, getUserById, getAllBookings, updateUserInfo} = require('./dbFiles/dbOperation');

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

    if (!token) {
        console.error("Access Denied: No token provided");
        return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        console.log("User Verified:", verified);
        next();
    } catch (error) {
        console.error("Invalid Token:", error.message);
        return res.status(403).json({ message: "Invalid Token" });
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



app.get('/admin/get-users', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, message: "Error fetching users" });
    }
});

app.put('/admin/update-role', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const { userId, newRole } = req.body;

    try {
        const result = await updateUserRole(userId, newRole);
        res.json(result);
    } catch (error) {
        console.error("Error updating role:", error);
        res.status(500).json({ success: false, message: "Error updating role" });
    }
});

app.delete('/admin/delete-user/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const { id } = req.params;

    try {
        const result = await deleteUser(id);
        res.json(result);
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Error deleting user" });
    }
});

app.get('/admin/get-user/:id', authenticateToken, async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            console.error("Unauthorized Admin Access Attempt");
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const { id } = req.params;
        console.log("Received user ID:", id);

        if (!id || isNaN(id)) {
            console.error("Invalid user ID in request:", id);
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        const user = await getUserById(parseInt(id, 10));
        if (!user) {
            console.error(`User with ID ${id} not found.`);
            return res.status(404).json({ success: false, message: "User not found" });
        }

        console.log("User data fetched successfully:", user);
        res.json(user);
    } catch (error) {
        console.error("CRITICAL ERROR in /admin/get-user/:id:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});




app.get('/admin/user-rentals/:id', authenticateToken, async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            console.error("Unauthorized Admin Rental History Access");
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        const { id } = req.params;
        console.log("Fetching rentals for user ID:", id);

        if (!id || isNaN(id)) {
            console.error("Invalid user ID:", id);
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        const rentals = await getUserRentals(parseInt(id, 10));

        if (!rentals.length) {
            console.log(`No rentals found for user ID ${id}`);
            return res.json([]);
        }

        res.json(rentals);
    } catch (error) {
        console.error("Error fetching user rentals:", error);
        res.status(500).json({ success: false, message: "Error fetching rentals" });
    }
});



app.put('/admin/update-rental-status', authenticateToken, async (req, res) => {
    const { rentalId, field, value } = req.body;
    await updateRentalStatus(rentalId, field, value);
    res.json({ success: true });
});



app.post('/admin/book-inflatable', authenticateToken, async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const { userId, inflatableId, startDate, endDate } = req.body;

    if (!userId || !inflatableId || !startDate || !endDate) {
        return res.status(400).json({ success: false, message: "Missing booking details" });
    }

    try {
        await saveBooking(userId, inflatableId, startDate, endDate);
        res.json({ success: true, message: "Booking successful!" });
    } catch (error) {
        console.error("Error booking inflatable:", error);
        res.status(500).json({ success: false, message: "Booking failed" });
    }
});


app.delete('/admin/cancel-booking/:id', authenticateToken, async (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid booking ID" });
    }

    try {
        await cancelBooking(parseInt(id, 10));
        res.json({ success: true, message: "Booking canceled successfully" });
    } catch (error) {
        console.error("Error canceling booking:", error);
        res.status(500).json({ success: false, message: "Error canceling booking" });
    }
});


app.post('/admin/create-user', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const { email, password, firstName, lastName, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const response = await registerUser(email, password, firstName, lastName, role);
    res.json(response);
});


app.get('/admin/get-bookings', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    try {
        const bookings = await getAllBookings();
        res.json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ success: false, message: "Error fetching bookings" });
    }
});



app.put('/admin/update-user', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const { id, firstName, lastName, phoneNumber } = req.body;

    if (!id || isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const result = await updateUserInfo(id, firstName, lastName, phoneNumber);
    res.status(result.success ? 200 : 500).json(result);
});



app.listen(8081, () => {
    console.log("Server is running on port 8081...");
});
