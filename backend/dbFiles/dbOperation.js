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
        console.log("Checking for user:", email);

        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM users WHERE username = @email');
        
            console.log("Query Result:", result.recordset);

        if (result.recordset.length > 0) {
            const user = result.recordset[0];

            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (isPasswordValid) {
                return { success: true, role: user.role, message: "Login Successful" };
            } else {
                console.log("Incorrect Password");
                return { success: false, message: "Invalid credentials" };
            }
        } else {
            console.log("No user found with that email"); 
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
            .query('INSERT INTO users (username, password) VALUES (@email, @password)');

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
            .query('SELECT * FROM users WHERE username = @email');

        if (result.recordset.length === 0) {
            return { success: false, message: "User not found" };
        }

        
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 3600000); // 

        
        await pool.request()
            .input('email', sql.VarChar, email)
            .input('resetToken', sql.VarChar, resetToken)
            .input('resetTokenExpires', sql.DateTime, resetTokenExpires)
            .query('UPDATE users SET reset_token = @resetToken, reset_token_expires = @resetTokenExpires WHERE username = @email');

        
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

        const email = result.recordset[0].username;

        
        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        
        await pool.request()
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, hashedPassword)
            .query('UPDATE users SET password = @password, reset_token = NULL, reset_token_expires = NULL WHERE username = @email');

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




module.exports = { loginUser, registerUser, sendResetEmail, requestPasswordReset, resetPassword, getFeaturedProducts, saveFeaturedProduct, saveInflatable, getInflatables, deleteInflatable};
