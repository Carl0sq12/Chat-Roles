import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { SupabaseRequestRepository } from '../../infrastructure/repositories/SupabaseRequestRepository';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const repo = new SupabaseRequestRepository();

export function useRequests() {
  const user        = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const adopterQuery = useQuery({
    queryKey: ['requests', 'adopter', user?.id],
    queryFn:  () => repo.getByAdopter(user!.id),
    enabled:  !!user && user.role === 'adoptante',
  });

  const shelterQuery = useQuery({
    queryKey: ['requests', 'shelter', user?.id],
    queryFn:  () => repo.getByShelter(user!.id),
    enabled:  !!user && user.role === 'refugio',
  });

  const createMutation = useMutation({
    mutationFn: ({
      petId, shelterId, message,
    }: { petId: string; shelterId: string; message?: string }) =>
      repo.create(petId, user!.id, shelterId, message),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['requests', 'adopter', user?.id] }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'aprobada' | 'rechazada' }) =>
      repo.updateStatus(id, status),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['requests', 'shelter', user?.id] }),
  });

  return {
    myRequests:     adopterQuery.data ?? [],
    shelterRequests: shelterQuery.data ?? [],
    isLoading:      adopterQuery.isLoading || shelterQuery.isLoading,
    sendRequest:    createMutation.mutate,
    updateStatus:   updateStatusMutation.mutate,
    isSending:      createMutation.isPending,
    sendError:      createMutation.error?.message ?? null,
  };
}