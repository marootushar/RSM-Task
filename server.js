const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const app = express();

// Load env
dotenv.config({ path: './config.env' });

// Connect Database
connectDB();

// Logging API Calls
app.use(
    morgan('dev', {
        skip: function (req, res) {
            return res.statusCode < 400;
        },
    })
);

app.use(
    morgan('common', {
        stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {
            flags: 'a',
        }),
    })
);

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api', require('./routes/auth'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    );
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
