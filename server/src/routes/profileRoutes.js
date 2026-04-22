import express from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  return res.json({ profile: req.user.toJSON() });
});

router.patch('/', requireAuth, async (req, res) => {
  try {
    const fullName = req.body.full_name || req.body.fullName;

    if (!fullName?.trim()) {
      return res.status(400).json({ message: 'Full name is required' });
    }

    req.user.full_name = fullName.trim();
    await req.user.save();

    return res.json({ profile: req.user.toJSON() });
  } catch (error) {
    console.error('Profile update failed:', error.message);
    return res.status(500).json({ message: 'Unable to update profile right now' });
  }
});

export default router;
