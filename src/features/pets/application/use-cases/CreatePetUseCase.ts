import { PetError } from '@shared/domain/errors/AppError';
import { Pet } from '../../domain/entities/Pet';
import { IPetRepository } from '../../domain/repositories/IPetRepository';

export class CreatePetUseCase {
  constructor(private readonly repo: IPetRepository) {}
  async execute(data: Omit<Pet, 'id' | 'createdAt'>): Promise<Pet> {
    if (!data.name) throw new PetError('El nombre es obligatorio');
    if (!data.shelterId) throw new PetError('El refugio es obligatorio');
    return this.repo.create(data);
  }
}