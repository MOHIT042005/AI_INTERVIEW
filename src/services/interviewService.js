import { supabase } from '../config/supabase';

const normalizeInterviewError = (error) => {
  if (!error) return new Error('Unknown interview service error');

  if (error.code === '42P01') {
    return new Error(
      'The Supabase "interviews" table is missing. Run the SQL setup in SUPABASE_SETUP.md, then reload the app.'
    );
  }

  if (error.code === '42501') {
    return new Error(
      'Your Supabase Row Level Security policy is blocking interview access. Check the interviews SELECT/INSERT/UPDATE policies in SUPABASE_SETUP.md.'
    );
  }

  return error instanceof Error ? error : new Error(error.message || 'Interview request failed');
};

export const interviewService = {
  createInterview: async (userId, type) => {
    const { data, error } = await supabase
      .from('interviews')
      .insert([{
        user_id: userId,
        topic: `${type.charAt(0).toUpperCase() + type.slice(1)} Interview`,
        type: type,
        duration: 0
      }])
      .select()
      .single();

    if (error) throw normalizeInterviewError(error);
    return data;
  },

  fetchUserInterviews: async (userId) => {
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw normalizeInterviewError(error);
    return data || [];
  },

  fetchInterviewById: async (interviewId) => {
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', interviewId)
      .single();

    if (error) throw normalizeInterviewError(error);
    return data;
  },

  updateInterview: async (interviewId, score, duration, feedback, metadata = {}) => {
    const updatePayload = {
      score: score,
      duration: duration,
      completed_at: new Date().toISOString(),
      feedback: feedback,
      answer_log: metadata.answers || null,
      highlights: metadata.highlights || null,
    };

    let { error } = await supabase
      .from('interviews')
      .update(updatePayload)
      .eq('id', interviewId);

    // Fallback for projects that haven't added the optional JSON columns yet.
    if (error?.code === '42703') {
      ({ error } = await supabase
        .from('interviews')
        .update({
          score: score,
          duration: duration,
          completed_at: new Date().toISOString(),
          feedback: feedback,
        })
        .eq('id', interviewId));
    }

    if (error) throw normalizeInterviewError(error);
  },
};
