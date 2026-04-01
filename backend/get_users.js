const mongoose = require('mongoose');

async function getUsers() {
    await mongoose.connect('mongodb+srv://admin:admin123@cluster0.ttgf2u6.mongodb.net/?appName=Cluster0');
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log(users.map(u => ({ email: u.email, role: u.role })));
    process.exit(0);
}

getUsers();
