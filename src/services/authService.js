import { supabase } from '../config/supabase';

export const authService = {
  signup: async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    // Save user profile in public table
    if (data.user) {
      await supabase.from('profiles').insert([
        {
          id: data.user.id,
          email: email,
          full_name: fullName,
          created_at: new Date(),
        },
      ]);
    }

    return data;
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },
};