import mongoose from 'mongoose';

const DEFAULT_RETRY = 3;

export async function connectDB(uri?: string, retries = DEFAULT_RETRY): Promise<void> {
  const mongoUri = uri || process.env.MONGO_URI;
  if (!mongoUri) throw new Error('MONGO_URI is not set');

  mongoose.set('strictQuery', false);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(mongoUri);
      console.log('MongoDB connected');
      attachListeners();
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${attempt} failed:`, err);
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, 1000 * attempt));
      } else {
        throw err;
      }
    }
  }
}

function attachListeners() {
  const conn = mongoose.connection;
  conn.on('connected', () => console.log('Mongoose connection: connected'));
  conn.on('error', (err) => console.error('Mongoose connection error:', err));
  conn.on('disconnected', () => console.log('Mongoose connection: disconnected'));
  conn.on('reconnected', () => console.log('Mongoose connection: reconnected'));
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  console.log('MongoDB disconnected');
}
