export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}