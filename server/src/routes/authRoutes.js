import crypto from 'crypto';
import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { createToken, requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'Email, password, and full name are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with that email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      full_name: fullName.trim(),
    });

    return res.status(201).json({
      token: createToken(user),
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Signup failed:', error.message);
    return res.status(500).json({ message: 'Unable to create account right now' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({
      token: createToken(user),
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Login failed:', error.message);
    return res.status(500).json({ message: 'Unable to log in right now' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  return res.json({ user: req.user.toJSON() });
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (user) {
      user.reset_password_token = crypto.randomBytes(24).toString('hex');
      user.reset_password_expires = new Date(Date.now() + 1000 * 60 * 30);
      await user.save();
    }

    return res.json({
      message: 'If that account exists, a password reset request has been recorded.',
    });
  } catch (error) {
    console.error('Forgot password failed:', error.message);
    return res.status(500).json({ message: 'Unable to process password reset right now' });
  }
});

export default router;
