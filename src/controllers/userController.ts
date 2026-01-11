import type { Request, Response, NextFunction } from 'express';
const { User, RefreshToken, Post, Comment } = require('../models');
const { hashPassword, comparePassword } = require('../utils/password');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');

function cookieOptions() {
  const opts: any = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  };
  return opts;
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, email, password, displayName } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(409).json({ error: 'username or email already exists' });
    const passwordHash = await hashPassword(password);
    const user = await User.create({ username, email, passwordHash, displayName });
    const access = signAccessToken({ id: user._id.toString(), username: user.username });
    const refresh = signRefreshToken({ id: user._id.toString() });
    // persist refresh token
    const rt = await RefreshToken.create({ userId: user._id, token: refresh, expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000) });
    res.cookie('refreshToken', refresh, cookieOptions());
    return res.status(201).json({ user: { id: user._id, username: user.username, email: user.email, displayName }, accessToken: access });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { identifier, password } = req.body; // identifier is email or username
    if (!identifier || !password) return res.status(400).json({ error: 'Missing fields' });
    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const access = signAccessToken({ id: user._id.toString(), username: user.username });
    const refresh = signRefreshToken({ id: user._id.toString() });
    await RefreshToken.create({ userId: user._id, token: refresh, expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000) });
    res.cookie('refreshToken', refresh, cookieOptions());
    return res.json({ user: { id: user._id, username: user.username }, accessToken: access });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const refresh = req.cookies?.refreshToken || req.body.refreshToken;
    if (refresh) {
      await RefreshToken.findOneAndUpdate({ token: refresh }, { revoked: true });
    }
    res.clearCookie('refreshToken');
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const refresh = req.cookies?.refreshToken || req.body.refreshToken;
    if (!refresh) return res.status(401).json({ error: 'Missing refresh token' });
    let payload;
    try {
      payload = verifyRefreshToken(refresh);
    } catch (e) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    const db = await RefreshToken.findOne({ token: refresh, revoked: false });
    if (!db) return res.status(401).json({ error: 'Refresh token revoked or not found' });
    const access = signAccessToken({ id: payload.sub, username: payload.username });
    // optional: rotate refresh token
    return res.json({ accessToken: access });
  } catch (err) {
    next(err);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await User.find().select('-passwordHash').limit(50);
    return res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const update: any = {};
    if (req.body.displayName) update.displayName = req.body.displayName;
    if (req.body.bio) update.bio = req.body.bio;
    if (req.body.password) update.passwordHash = await hashPassword(req.body.password);
    const updated = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-passwordHash');
    if (!updated) return res.status(404).json({ error: 'User not found' });
    return res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const requester = (req as any).user?.id;
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });
    if (requester !== req.params.id) return res.status(403).json({ error: 'Forbidden' });

    // delete posts and comments by this user
    await Post.deleteMany({ senderId: req.params.id });
    await Comment.deleteMany({ authorId: req.params.id });
    await User.findByIdAndDelete(req.params.id);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
