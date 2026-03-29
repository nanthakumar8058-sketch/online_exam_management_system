const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`\n⚠️  DATABASE CONNECTION ERROR ⚠️`);
        console.error(error.message || error);
        console.log(`The server will continue to run, but database-dependent features will fail.\n`);
        // process.exit(1); removed to prevent crash
    }
};

module.exports = connectDB;
