import { Pet } from '../entities/Pet';

export interface PetFilters {
  species?: string;
  size?:    string;
  gender?:  string;
  status?:  string;
}

export interface IPetRepository {
  getAll(filters?: PetFilters): Promise<Pet[]>;
  getById(id: string): Promise<Pet>;
  getByShelter(shelterId: string): Promise<Pet[]>;
  create(pet: Omit<Pet, 'id' | 'createdAt'>): Promise<Pet>;
  update(id: string, data: Partial<Pet>): Promise<Pet>;
  delete(id: string): Promise<void>;
}