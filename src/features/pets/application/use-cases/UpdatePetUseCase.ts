import { Pet } from '../../domain/entities/Pet';
import { IPetRepository } from '../../domain/repositories/IPetRepository';

export class UpdatePetUseCase {
  constructor(private readonly repo: IPetRepository) {}
  execute(id: string, data: Partial<Pet>): Promise<Pet> {
    return this.repo.update(id, data);
  }
}