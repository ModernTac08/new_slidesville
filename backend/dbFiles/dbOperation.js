const config = require('./dbConfig');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

// User Login
async function loginUser(email, password) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM users WHERE email = @email');


        if (result.recordset.length === 0) {
            return { success: false, message: "Invalid credentials" };
        }

        const user = result.recordset[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (isPasswordValid) {
            return { 
                success: true, 
                id: user.id, 
                email: user.email, 
                role: user.role, 
                message: "Login Successful" 
            };
        } else {
            return { success: false, message: "Invalid credentials" };
        }
    } catch (error) {
        console.error("Error during login:", error);
        return { success: false, message: "Error logging in." };
    }
}


// User SignUp
async function registerUser(email, password) {
    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        
        const pool = await sql.connect(config);
        await pool.request()
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, hashedPassword)
            .query('INSERT INTO users (email, password) VALUES (@email, @password)');

        return { success: true, message: "Account created successfully" };
    } catch (error) {
        console.error("Error during signup:", error);
        return { success: false, message: "Error creating account" };
    }
}


// Password Reset
async function requestPasswordReset(email) {
    try {
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM users WHERE email = @email');

        if (result.recordset.length === 0) {
            return { success: false, message: "User not found" };
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 3600000);

        await pool.request()
            .input('email', sql.VarChar, email)
            .input('resetToken', sql.VarChar, resetToken)
            .input('resetTokenExpires', sql.DateTime, resetTokenExpires)
            .query('UPDATE users SET reset_token = @resetToken, reset_token_expires = @resetTokenExpires WHERE email = @email');

        await sendResetEmail(email, resetToken);

        return { success: true, message: "Password reset email sent" };
    } catch (error) {
        console.error("Error in requestPasswordReset:", error);
        return { success: false, message: "Error requesting password reset" };
    }
}

async function sendResetEmail(email, token) {
    const transporter = nodemailer.createTransport({
        host: "smtp.office365.com", 
        port: 587, 
        secure: false, 
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS,
        }
    });

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    
    const mailOptions = {
        from: `Slidesville Support <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset Your Password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password. The link expires in 1 hour.</p>`
    };

    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to:", email);
}

async function resetPassword(token, newPassword) {
    try {
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('token', sql.VarChar, token)
            .query('SELECT * FROM users WHERE reset_token = @token AND reset_token_expires > GETDATE()');

        if (result.recordset.length === 0) {
            return { success: false, message: "Invalid or expired token" };
        }

        const email = result.recordset[0].email;
        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        await pool.request()
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, hashedPassword)
            .query('UPDATE users SET password = @password, reset_token = NULL, reset_token_expires = NULL WHERE email = @email');

        return { success: true, message: "Password reset successful" };
    } catch (error) {
        console.error("Error in resetPassword:", error);
        return { success: false, message: "Error resetting password" };
    }
}



//This is for the Featured Product uploads

async function saveFeaturedProduct(id, description, imagePath) {
    try {
        const pool = await sql.connect(config);
        let query = `
            UPDATE featured_products 
            SET description = @description 
            WHERE id = @id;
        `;

        if (imagePath) {
            query = `
                UPDATE featured_products 
                SET description = @description, imagePath = @imagePath 
                WHERE id = @id;
            `;
        }

        await pool.request()
            .input('id', sql.Int, id)
            .input('description', sql.Text, description)
            .input('imagePath', sql.VarChar, imagePath || null)
            .query(query);

        return { success: true, message: "Product updated in database" };
    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, message: "Error updating database" };
    }
}

async function getFeaturedProducts() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query("SELECT * FROM featured_products");
        return result.recordset;
    } catch (error) {
        console.error("Error fetching featured products:", error);
        return [];
    }
}


/* This is for the Inflatables Page */

async function saveInflatable(id, name, price, imagePath) {
    try {
        const pool = await sql.connect(config);
        let query;
        let request = pool.request()
            .input('name', sql.VarChar, name)
            .input('price', sql.Decimal(10,2), price);

        if (id) {
            if (imagePath) {
                query = `UPDATE inflatables 
                         SET name = @name, price = @price, imagePath = @imagePath 
                         WHERE id = @id`;
                request.input('imagePath', sql.VarChar, imagePath);
            } else {
                query = `UPDATE inflatables 
                         SET name = @name, price = @price 
                         WHERE id = @id`;
            }
            request.input('id', sql.Int, id);
            await request.query(query);
            return { success: true, message: "Inflatable updated successfully", id, imagePath };
        } else {
            query = `INSERT INTO inflatables (name, price, imagePath) 
                     OUTPUT INSERTED.id, INSERTED.imagePath
                     VALUES (@name, @price, @imagePath)`;
            request.input('imagePath', sql.VarChar, imagePath || null);
            const result = await request.query(query);
            return { success: true, message: "New inflatable added", id: result.recordset[0].id, imagePath: result.recordset[0].imagePath };
        }
    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, message: "Error saving inflatable." };
    }
}


async function getInflatables() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query("SELECT * FROM inflatables");

        return result.recordset.map(item => ({
            ...item,
            imagePath: item.imagePath 
                ? `http://localhost:8081${item.imagePath.replace(/\\/g, '/')}` 
                : ''
        }));
    } catch (error) {
        console.error("Error fetching inflatables:", error);
        return [];
    }
}


async function deleteInflatable(id) {
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM inflatables WHERE id = @id");

        return { success: true, message: "Inflatable deleted successfully" };
    } catch (error) {
        console.error("Error deleting inflatable:", error);
        return { success: false, message: "Error deleting inflatable from the database" };
    }
}

/* This is for the Booking Stuff */

async function getAvailableInflatables(startDate, endDate) {
    try {
        const pool = await sql.connect(config);

        
        const result = await pool.request()
            .input("startDate", sql.Date, startDate)
            .input("endDate", sql.Date, endDate)
            .query(`
                SELECT * FROM inflatables 
                WHERE id NOT IN (
                    SELECT inflatableId FROM bookings 
                    WHERE (startDate <= @endDate AND endDate >= @startDate)
                )
            `);

        return result.recordset;
    } catch (error) {
        console.error("Error getting available inflatables:", error);
        return [];
    }
}

async function saveBooking(userId, inflatableId, startDate, endDate) {
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('inflatableId', sql.Int, inflatableId)
            .input('startDate', sql.Date, startDate)
            .input('endDate', sql.Date, endDate)
            .query(`
                INSERT INTO bookings (userId, inflatableId, startDate, endDate) 
                VALUES (@userId, @inflatableId, @startDate, @endDate)
            `);

        return { success: true, message: "Booking saved successfully" };
    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, message: "Error saving booking." };
    }
}





/* User Functions */

async function getUserBookings(userId) {
    try {
        const pool = await sql.connect(config);
        
        if (!userId || isNaN(userId)) {
            console.error("Invalid userId:", userId);
            return { success: false, message: "Invalid user ID" };
        }

        const result = await pool.request()
            .input('userId', sql.Int, parseInt(userId, 10))
            .query(`
                SELECT b.id, i.name AS inflatableName, b.startDate, b.endDate
                FROM bookings b
                JOIN inflatables i ON b.inflatableId = i.id
                WHERE b.userId = @userId
                ORDER BY b.startDate ASC
            `);

        return result.recordset;
    } catch (error) {
        console.error("Database Error: Unable to fetch user bookings", error);
        return [];
    }
}



async function getUserProfile(userId) {
    try {
        const pool = await sql.connect(config);

        if (isNaN(userId)) {
            console.error("Invalid userId provided:", userId);
            return { success: false, message: "Invalid user ID" };
        }

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query('SELECT firstName, lastName, phoneNumber, email FROM users WHERE id = @userId');

        if (result.recordset.length === 0) {
            console.error("No user found with ID:", userId);
            return { success: false, message: "User not found." };
        }

        console.log("Fetched user profile:", result.recordset[0]);
        return result.recordset[0];
    } catch (error) {
        console.error("Database Error: Unable to fetch user profile", error);
        return { success: false, message: "Error fetching profile" };
    }
}


async function updateUserProfile(userId, email, firstName, lastName, phoneNumber) {
    try {
        console.log("Updating profile for userId:", userId, "with data:", { email, firstName, lastName, phoneNumber });

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .input('email', sql.VarChar, email)
            .input('firstName', sql.VarChar, firstName)
            .input('lastName', sql.VarChar, lastName)
            .input('phoneNumber', sql.VarChar, phoneNumber)
            .query(`UPDATE users SET email = @email, firstName = @firstName, lastName = @lastName, phoneNumber = @phoneNumber WHERE id = @userId;`);

        console.log("SQL Update Result:", result);

        return { success: true, message: "Profile updated successfully!" };
    } catch (error) {
        console.error("Database Error: Unable to update user profile", error);
        return { success: false, message: "Error updating profile" };
    }
}



async function cancelBooking(bookingId, userId) {
    try {
        const pool = await sql.connect(config);

        if (isNaN(userId) || isNaN(bookingId)) {
            console.error("Invalid userId or bookingId:", { userId, bookingId });
            return { success: false, message: "Invalid user ID or booking ID" };
        }

        const result = await pool.request()
            .input('bookingId', sql.Int, parseInt(bookingId, 10))
            .input('userId', sql.Int, parseInt(userId, 10))
            .query('DELETE FROM bookings WHERE id = @bookingId AND userId = @userId');

        if (result.rowsAffected[0] > 0) {
            return { success: true, message: "Booking canceled successfully!" };
        } else {
            return { success: false, message: "Booking not found or unauthorized!" };
        }
    } catch (error) {
        console.error("Database Error: Unable to cancel booking", error);
        return { success: false, message: "Error canceling booking" };
    }
}






module.exports = { loginUser, registerUser, sendResetEmail, requestPasswordReset, 
    resetPassword, getFeaturedProducts, saveFeaturedProduct, saveInflatable, getInflatables, 
    deleteInflatable, saveBooking, getAvailableInflatables, getUserBookings, updateUserProfile, getUserProfile, cancelBooking};
