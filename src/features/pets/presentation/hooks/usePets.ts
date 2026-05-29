import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { CreatePetUseCase } from '../../application/use-cases/CreatePetUseCase';
import { DeletePetUseCase } from '../../application/use-cases/DeletePetUseCase';
import { GetPetsUseCase } from '../../application/use-cases/GetPetsUseCase';
import { UpdatePetUseCase } from '../../application/use-cases/UpdatePetUseCase';
import { Pet, PetStatus } from '../../domain/entities/Pet';
import { PetFilters } from '../../domain/repositories/IPetRepository';
import { SupabasePetRepository } from '../../infrastructure/repositories/SupabasePetRepository';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const repo           = new SupabasePetRepository();
const getPetsUseCase = new GetPetsUseCase(repo);
const createUseCase  = new CreatePetUseCase(repo);
const updateUseCase  = new UpdatePetUseCase(repo);
const deleteUseCase  = new DeletePetUseCase(repo);

export function usePets(filters?: PetFilters) {
  const queryClient = useQueryClient();
  const user        = useAuthStore((s) => s.user);
  const queryKey    = ['pets', filters];

  const { data: pets = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: () => getPetsUseCase.execute(filters),
    enabled: !!user,
  });

  const shelterQuery = useQuery({
    queryKey: ['pets', 'shelter', user?.id],
    queryFn:  () => repo.getByShelter(user!.id),
    enabled:  !!user && user.role === 'refugio',
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Pet, 'id' | 'createdAt'>) => createUseCase.execute(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pets'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Pet> }) =>
      updateUseCase.execute(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pets'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUseCase.execute(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pets'] }),
  });

  return {
    pets,
    shelterPets:   shelterQuery.data ?? [],
    isLoading,
    error:         error?.message ?? null,
    createPet:     createMutation.mutate,
    updatePet:     updateMutation.mutate,
    deletePet:     deleteMutation.mutate,
    isCreating:    createMutation.isPending,
    isUpdating:    updateMutation.isPending,
    createError:   createMutation.error?.message ?? null,
  };
}