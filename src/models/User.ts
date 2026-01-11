import { Schema, model } from 'mongoose';
import { UserDoc } from '../types/models';

const userSchema = new Schema<UserDoc>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    displayName: { type: String },
    bio: { type: String },
  },
  { timestamps: true }
);

userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

export const User = model<UserDoc>('User', userSchema);
