import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Interview } from '../models/Interview.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const interviews = await Interview.find({ user_id: req.user.id }).sort({ created_at: -1 });
    return res.json({ interviews: interviews.map((interview) => interview.toJSON()) });
  } catch (error) {
    console.error('Load interviews failed:', error.message);
    return res.status(500).json({ message: 'Unable to load interviews right now' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const type = req.body.type?.trim();

    if (!type) {
      return res.status(400).json({ message: 'Interview type is required' });
    }

    const interview = await Interview.create({
      user_id: req.user.id,
      topic: `${type.charAt(0).toUpperCase()}${type.slice(1)} Interview`,
      type,
      duration: 0,
    });

    return res.status(201).json({ interview: interview.toJSON() });
  } catch (error) {
    console.error('Create interview failed:', error.message);
    return res.status(500).json({ message: 'Unable to create interview right now' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    return res.json({ interview: interview.toJSON() });
  } catch (error) {
    console.error('Fetch interview failed:', error.message);
    return res.status(500).json({ message: 'Unable to load interview right now' });
  }
});

router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    interview.score = req.body.score ?? interview.score;
    interview.duration = req.body.duration ?? interview.duration;
    interview.feedback = req.body.feedback ?? interview.feedback;
    interview.answer_log = req.body.answer_log ?? interview.answer_log;
    interview.highlights = req.body.highlights ?? interview.highlights;
    interview.completed_at = new Date();

    await interview.save();

    return res.json({ interview: interview.toJSON() });
  } catch (error) {
    console.error('Update interview failed:', error.message);
    return res.status(500).json({ message: 'Unable to update interview right now' });
  }
});

export default router;
