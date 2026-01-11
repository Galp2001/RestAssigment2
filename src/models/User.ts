import { Schema, model } from 'mongoose';
import { UserDoc } from '../types/models';

const userSchema = new Schema<UserDoc>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    displayName: { type: String },
    bio: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

// `unique: true` on the schema paths already creates the indexes.
// Removed duplicate explicit index declarations to avoid warnings.

export const User = model<UserDoc>('User', userSchema);
