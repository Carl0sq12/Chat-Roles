import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { SupabaseAuthRepository } from '@features/auth/infrastructure/repositories/SupabaseAuthRepository';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});
const authRepo = new SupabaseAuthRepository();

function AuthGuard() {
  const { user, setUser } = useAuthStore();
  const segments  = useSegments();
  const router    = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function restoreSession() {
      try {
        const user = await authRepo.getCurrentUser();
        setUser(user);
      } catch {
        setUser(null);
      } finally {
        setIsReady(true);
      }
    }
    restoreSession();
  }, [setUser]);

  useEffect(() => {
    if (!isReady) return;
    const inAuth    = (segments[0] as string) === '(auth)';
    const inAdopter = (segments[0] as string) === '(adopter)';
    const inShelter = (segments[0] as string) === '(shelter)';

    if (!user && !inAuth) {
      router.replace('/(auth)/login' as any);
    } else if (user && inAuth) {
      router.replace((user.role === 'refugio' ? '/(shelter)' : '/(adopter)') as any);
    } else if (user && user.role === 'refugio' && inAdopter) {
      router.replace('/(shelter)' as any);
    } else if (user && user.role === 'adoptante' && inShelter) {
      router.replace('/(adopter)' as any);
    }
  }, [user, segments, isReady, router]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard />
    </QueryClientProvider>
  );
}