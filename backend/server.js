
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');


dotenv.config();


connectDB();

const app = express();


app.use(express.json());
app.use(cookieParser());


app.use(cors());


const auth = require('./routes/auth');
const jobs = require('./routes/jobs');

app.use('/api/v1/auth', auth);
app.use('/api/v1/jobs', jobs);


const errorHandler = require('./middleware/error');
app.use(errorHandler);


app.get('/', (req, res) => {
    res.send('Job Portal API is running...');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
