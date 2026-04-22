import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const createToken = (user) =>
  jwt.sign({ userId: user.id || user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      console.error('Auth token verification failed:', error.message);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    console.error('Auth middleware database failure:', error.message);
    return res.status(503).json({
      message: 'Authentication could not be completed because the database is unavailable.',
    });
  }
};
