import { Pet } from '../../domain/entities/Pet';
import { IPetRepository, PetFilters } from '../../domain/repositories/IPetRepository';

export class GetPetsUseCase {
  constructor(private readonly repo: IPetRepository) {}
  execute(filters?: PetFilters): Promise<Pet[]> {
    return this.repo.getAll(filters);
  }
}