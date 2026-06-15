const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    // If no URI is provided, use in-memory database
    if (!uri) {
      console.log('No MONGO_URI provided. Starting in-memory MongoDB...');
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
    }

    const conn = await mongoose.connect(uri || 'mongodb://localhost:27017/cardekho');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // If we created an in-memory DB, seed it automatically
    if (mongoServer) {
      console.log('Seeding in-memory database...');
      const { seedDB } = require('../data/seed.js');
      await seedDB(true);
      console.log('In-memory database seeded successfully!');
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
