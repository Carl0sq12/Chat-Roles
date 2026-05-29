import { User, UserRole } from '../entities/User';

export interface IAuthRepository {
  login(email: string, password: string): Promise<User>;
  loginWithGoogle(): Promise<User>;
  register(
    email: string,
    password: string,
    username: string,
    role: UserRole,
    extra?: Record<string, any>
  ): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  resetPassword(email: string): Promise<void>;
}