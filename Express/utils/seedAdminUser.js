const User = require('../models/user');

async function seedAdminUser() {
  const existingAdmin = await User.findOne({ role: 'admin' });
  if (!existingAdmin) {
    await User.create({ username: 'admin', password: 'admin123', role: 'admin' });
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }
}

module.exports = seedAdminUser;
