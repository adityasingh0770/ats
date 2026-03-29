const mongoose = require('mongoose');

const MAX_RETRIES  = 5;
const RETRY_DELAY  = 5000; // ms between retries

const connectDB = async (attempt = 1) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 20000,
      connectTimeoutMS:         20000,
      socketTimeoutMS:          45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Reconnect automatically if connection drops after initial success
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected — attempting to reconnect…');
      setTimeout(() => connectDB(1), RETRY_DELAY);
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message);
    });

  } catch (error) {
    console.error(`❌ MongoDB connection attempt ${attempt} failed: ${error.message}`);

    if (attempt < MAX_RETRIES) {
      console.log(`   Retrying in ${RETRY_DELAY / 1000}s… (${attempt}/${MAX_RETRIES})`);
      setTimeout(() => connectDB(attempt + 1), RETRY_DELAY);
    } else {
      console.error('❌ MongoDB connection failed after all retries.');
      console.error('   Possible causes:');
      console.error('   1. WiFi router is blocking outbound port 27017 → switch to mobile hotspot');
      console.error('   2. MONGO_URI in .env is wrong');
      console.error('   3. Atlas IP Access List does not include 0.0.0.0/0');
      console.error('   4. Atlas cluster is paused');
      // Do NOT call process.exit — keep the server alive so routes return 503 via handleError
    }
  }
};

module.exports = connectDB;
