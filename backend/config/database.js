import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Get MongoDB URI from environment or use default
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pharmacy';
    
    console.log('🔗 Connecting to MongoDB...');
    console.log(`   URI: ${mongoURI}`);

    await mongoose.connect(mongoURI);

    console.log('✅ MongoDB Connected Successfully!');
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('\n📝 To fix this, you have 2 options:');
    console.log('   1. LOCAL: Install MongoDB and run: mongod');
    console.log('   2. CLOUD: Use MongoDB Atlas (free) at https://www.mongodb.com/cloud/atlas');
    console.log('      Then set: set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pharmacy');
    return false;
  }
};

export default connectDB;
