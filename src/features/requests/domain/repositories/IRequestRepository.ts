import { AdoptionRequest } from '../entities/Request';

export interface IRequestRepository {
  getByAdopter(adopterId: string): Promise<AdoptionRequest[]>;
  getByShelter(shelterId: string): Promise<AdoptionRequest[]>;
  create(petId: string, adopterId: string, shelterId: string, message?: string): Promise<AdoptionRequest>;
  updateStatus(id: string, status: 'aprobada' | 'rechazada'): Promise<AdoptionRequest>;
}