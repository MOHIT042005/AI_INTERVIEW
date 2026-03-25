import { supabase } from '../config/supabase';

export const userService = {
  createProfile: async (userId, email, fullName) => {
    const { error } = await supabase.from('profiles').insert([
      {
        id: userId,
        email: email,
        full_name: fullName,
        created_at: new Date(),
      },
    ]);

    if (error) throw error;
  },

  fetchProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  updateProfile: async (userId, updates) => {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) throw error;
  },
};