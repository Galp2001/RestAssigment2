"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
exports.disconnectDB = disconnectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const DEFAULT_RETRY = 3;
async function connectDB(uri, retries = DEFAULT_RETRY) {
    const mongoUri = uri || process.env.MONGO_URI;
    if (!mongoUri)
        throw new Error('MONGO_URI is not set');
    mongoose_1.default.set('strictQuery', false);
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await mongoose_1.default.connect(mongoUri);
            console.log('MongoDB connected');
            attachListeners();
            return;
        }
        catch (err) {
            console.error(`MongoDB connection attempt ${attempt} failed:`, err);
            if (attempt < retries) {
                await new Promise((res) => setTimeout(res, 1000 * attempt));
            }
            else {
                throw err;
            }
        }
    }
}
function attachListeners() {
    const conn = mongoose_1.default.connection;
    conn.on('connected', () => console.log('Mongoose connection: connected'));
    conn.on('error', (err) => console.error('Mongoose connection error:', err));
    conn.on('disconnected', () => console.log('Mongoose connection: disconnected'));
    conn.on('reconnected', () => console.log('Mongoose connection: reconnected'));
}
async function disconnectDB() {
    await mongoose_1.default.disconnect();
    console.log('MongoDB disconnected');
}
//# sourceMappingURL=db.js.map