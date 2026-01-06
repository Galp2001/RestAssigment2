import { Schema, model, Types } from 'mongoose';
import { CommentDoc } from '../types/models';

const commentSchema = new Schema<CommentDoc>(
  {
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    authorId: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

commentSchema.index({ postId: 1 });

export const Comment = model<CommentDoc>('Comment', commentSchema);
