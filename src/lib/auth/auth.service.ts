import { supabase } from '../supabase';
import type { SignUpData, SignInData, AuthError } from './types';

export class AuthService {
  static async signUp({ email, password, name }: SignUpData) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async signIn({ email, password }: SignInData) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async resetPassword(email: string) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private static handleError(error: unknown): AuthError {
    if (error instanceof Error) {
      return { message: error.message };
    }
    return { message: 'An unexpected error occurred' };
  }
}