const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const Community = require('./models/Community');
const User = require('./models/User');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Read JSON files
const communities = JSON.parse(
  fs.readFileSync(`${__dirname}/data/communities.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    // Clear existing data first
    await Community.deleteMany();
    await User.deleteMany({ role: { $ne: 'superadmin' } }); // Keep superadmins if any

    console.log('Clearing old data...');

    // Import communities
    const createdCommunities = await Community.insertMany(communities);
    console.log('Communities Imported...');

    // Create the initial Admin User
    // The admin will be part of the first community in the list
    const adminUser = {
      fullName: process.env.ADMIN_FULLNAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
      community: createdCommunities[0]._id, // Assign to Greenwood Community
    };

    await User.create(adminUser);
    console.log('Admin User Created...');

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Community.deleteMany();
    await User.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
    console.log('Please use the -i flag to import data or -d to destroy data.');
    process.exit();
}