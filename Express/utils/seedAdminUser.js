const User = require('../models/user');

async function seedAdminUser() {
  const existingAdmin = await User.findOne({ role: 'admin' });
  if (!existingAdmin) {
    await User.create({
      firstname: 'Admin',               // Required
      lastname: 'Admin',                 // Required
      email: 'admin@example.com',       // Required, must be unique
      password: 'admin123',             // Required
      address: '123 Admin Lane',        // Required
      phoneNum: '1234567890',           // Required
      role: 'admin',                    // Default: 'user', explicitly set to 'admin'
      profilePic: ''                    // Optional, default is an empty string
    });
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }
}

module.exports = seedAdminUser;
