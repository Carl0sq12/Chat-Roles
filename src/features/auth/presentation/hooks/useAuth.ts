import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { LoginUseCase } from '../../application/use-cases/LoginUseCase';
import { RegisterUseCase } from '../../application/use-cases/RegisterUseCase';
import { SupabaseAuthRepository } from '../../infrastructure/repositories/SupabaseAuthRepository';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../../domain/entities/User';

type RegisterDto = {
  email: string; password: string; username: string;
  role: UserRole; extra?: Record<string, any>;
};

const authRepo        = new SupabaseAuthRepository();
const loginUseCase    = new LoginUseCase(authRepo);
const registerUseCase = new RegisterUseCase(authRepo);

export function useAuth() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUseCase.execute(email, password),
    onSuccess: (user) => {
      setUser(user);
      router.replace((user.role === 'refugio' ? '/(shelter)' : '/(adopter)') as any);
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ email, password, username, role, extra }: RegisterDto) =>
      registerUseCase.execute(email, password, username, role, extra),
    onSuccess: (user) => {
      setUser(user);
      router.replace((user.role === 'refugio' ? '/(shelter)' : '/(adopter)') as any);
    },
  });

  const logout = async () => {
    try { await authRepo.logout(); }
    finally { setUser(null); router.replace('/(auth)/login' as any); }
  };

  const resetPassword = async (email: string) => {
    await authRepo.resetPassword(email);
  };

  return {
    user,
    login:         loginMutation.mutate,
    register:      registerMutation.mutate,
    logout,
    resetPassword,
    isLoading:     loginMutation.isPending || registerMutation.isPending,
    error:         loginMutation.error?.message ?? registerMutation.error?.message ?? null,
  };
}