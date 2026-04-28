import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.js';
import { Interview } from '../models/Interview.js';

const emptyDraftQuery = {
  duration: 0,
  score: null,
  feedback: '',
  completed_at: null,
  'answer_log.0': { $exists: false },
  'highlights.0': { $exists: false },
};

const run = async () => {
  try {
    await connectDatabase();

    const count = await Interview.countDocuments(emptyDraftQuery);
    if (count === 0) {
      console.log('No empty draft interviews found.');
      return;
    }

    const result = await Interview.deleteMany(emptyDraftQuery);
    console.log(`Deleted ${result.deletedCount} empty draft interviews.`);
  } catch (error) {
    console.error('Interview cleanup failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
