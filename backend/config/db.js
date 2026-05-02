import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not configured');
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('--- MongoDB Connection Detail ---');
    console.error(`Error Name: ${error.name}`);
    console.error(`Error Message: ${error.message}`);
    if (error.reason) console.error(`Reason: ${JSON.stringify(error.reason)}`);
    console.error('---------------------------------');
    process.exit(1);
  }
};

export default connectDB;
