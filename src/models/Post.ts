import { Schema, model } from 'mongoose';
import { PostDoc } from '../types/models';

const postSchema = new Schema<PostDoc>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    senderId: { type: String, required: true },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.index({ senderId: 1 });

export const Post = model<PostDoc>('Post', postSchema);
