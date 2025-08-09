const mongoose = require("mongoose");
const dbgr = require("debug")('development:mongoose');

const connectDB = async () => {
  const mongoURL = process.env.MONGO_DB_URL ;
  try {
   await mongoose.connect(mongoURL, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    dbgr("Mongo DB connect successfully");
  } catch (err) {
    dbgr(`Error to connecting : ${err.message}`);
  }
};

module.exports = connectDB;
