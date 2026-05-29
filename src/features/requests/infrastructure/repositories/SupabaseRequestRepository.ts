import { supabase } from '@shared/infrastructure/supabase/client';
import { AdoptionRequest } from '../../domain/entities/Request';
import { IRequestRepository } from '../../domain/repositories/IRequestRepository';

export class SupabaseRequestRepository implements IRequestRepository {

  async getByAdopter(adopterId: string): Promise<AdoptionRequest[]> {
    const { data, error } = await supabase
      .from('adoption_requests')
      .select('*, pets(name, image_url)')
      .eq('adopter_id', adopterId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(this._map);
  }

  async getByShelter(shelterId: string): Promise<AdoptionRequest[]> {
    const { data, error } = await supabase
      .from('adoption_requests')
      .select('*, pets(name, image_url), profiles(username)')
      .eq('shelter_id', shelterId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(this._map);
  }

  async create(
    petId: string,
    adopterId: string,
    shelterId: string,
    message?: string
  ): Promise<AdoptionRequest> {
    const { data, error } = await supabase
      .from('adoption_requests')
      .insert({ pet_id: petId, adopter_id: adopterId, shelter_id: shelterId, message })
      .select().single();
    if (error) throw new Error(error.message);
    return this._map(data);
  }

  async updateStatus(
    id: string,
    status: 'aprobada' | 'rechazada'
  ): Promise<AdoptionRequest> {
    const { data, error } = await supabase
      .from('adoption_requests')
      .update({ status })
      .eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return this._map(data);
  }

  private _map = (raw: any): AdoptionRequest => ({
    id:          raw.id,
    petId:       raw.pet_id,
    petName:     raw.pets?.name ?? undefined,
    petImage:    raw.pets?.image_url ?? undefined,
    adopterId:   raw.adopter_id,
    adopterName: raw.profiles?.username ?? undefined,
    shelterId:   raw.shelter_id,
    message:     raw.message ?? undefined,
    status:      raw.status,
    createdAt:   new Date(raw.created_at),
  });
} 