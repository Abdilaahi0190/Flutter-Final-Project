// Ku dar modules-ka muhiimka ah
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Ku loading-garee variables-ka .env file-ka ku jira
dotenv.config();

// Ku xidh dhowr-kaydka (Database-ka)
connectDB();

const app = express();

// Middleware loogu talagalay in lagu akhriyo JSON iyo Cookies
app.use(express.json());
app.use(cookieParser());

// U oggolow codsiyada ka imnaya meelo kale (CORS)
app.use(cors());

// Mount-garee router-lada (Routes setup)
const auth = require('./routes/auth');
const jobs = require('./routes/jobs');

app.use('/api/v1/auth', auth);
app.use('/api/v1/jobs', jobs);

// Middleware-ka loogu talagalay qabashada khaladaadka
const errorHandler = require('./middleware/error');
app.use(errorHandler);

// Waddada asaasiga ah ee API-ga
app.get('/', (req, res) => {
    res.send('Job Portal API is running...');
});

// Port-ka uu server-ku ku shaqaynayo
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
