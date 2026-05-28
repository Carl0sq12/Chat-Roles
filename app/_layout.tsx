import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { AppwriteAuthRepository } from '@features/auth/infrastructure/repositories/AppwriteAuthRepository';
import { requestNotificationPermissions } from '@shared/infrastructure/notifications/NotificationService';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } }
});
const authRepo = new AppwriteAuthRepository();

function AuthGuard() {
  const { user, setUser } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
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
    requestNotificationPermissions();
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const inAuth = segments[0] === '(auth)';
    if (!user && !inAuth) router.replace('/(auth)/login');
    if (user && inAuth) router.replace('/(app)');
  }, [user, segments, isReady]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard />
    </QueryClientProvider>
  );
}