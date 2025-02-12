const express = require('express');
const cors = require('cors');
const { loginUser, registerUser, requestPasswordReset, resetPassword } = require('./dbFiles/dbOperation');


const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
}));


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.json(result);
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



app.listen(8081, () => {
    console.log("Server is running on port 8081...");
});
