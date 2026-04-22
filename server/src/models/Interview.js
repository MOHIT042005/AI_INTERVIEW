import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: null,
    },
    feedback: {
      type: String,
      default: '',
    },
    answer_log: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    highlights: {
      type: [String],
      default: [],
    },
    completed_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    versionKey: false,
  }
);

interviewSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    ret.user_id = ret.user_id?.toString?.() || ret.user_id;
    delete ret._id;
    return ret;
  },
});

export const Interview = mongoose.model('Interview', interviewSchema);
