const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ SUCCESS: Backend is connected to MongoDB!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ ERROR: Could not connect to MongoDB.');
        console.error(err.message);
        process.exit(1);
    });
