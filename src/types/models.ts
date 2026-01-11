import { Document, Types } from 'mongoose';

export interface PostInput {
  title: string;
  body: string;
  senderId: string;
}

export interface CommentInput {
  postId: string;
  authorId: string;
  text: string;
}

export interface PostDoc extends Document {
  title: string;
  body: string;
  senderId: string | Types.ObjectId;
  likes?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentDoc extends Document {
  postId: Types.ObjectId | string;
  authorId: string | Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDoc extends Document {
  username: string;
  email: string;
  passwordHash: string;
  displayName?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RefreshTokenDoc extends Document {
  userId: Types.ObjectId | string;
  token: string;
  expiresAt: Date;
  revoked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
