export interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
  };
  created_at: string;
}

export type UserRole = 'admin' | 'user';

export interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
}
