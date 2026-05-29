import { supabase } from '@shared/infrastructure/supabase/client';
import { Pet } from '../../domain/entities/Pet';
import { IPetRepository, PetFilters } from '../../domain/repositories/IPetRepository';

export class SupabasePetRepository implements IPetRepository {

  async getAll(filters?: PetFilters): Promise<Pet[]> {
    let query = supabase
      .from('pets')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false });

    if (filters?.species) query = query.eq('species', filters.species);
    if (filters?.size)    query = query.eq('size', filters.size);
    if (filters?.gender)  query = query.eq('gender', filters.gender);
    if (filters?.status)  query = query.eq('status', filters.status);
    else query = query.eq('status', 'disponible');

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data ?? []).map(this._map);
  }

  async getById(id: string): Promise<Pet> {
    const { data, error } = await supabase
      .from('pets').select('*, profiles(username)')
      .eq('id', id).single();
    if (error) throw new Error(error.message);
    return this._map(data);
  }

  async getByShelter(shelterId: string): Promise<Pet[]> {
    const { data, error } = await supabase
      .from('pets').select('*')
      .eq('shelter_id', shelterId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(this._map);
  }

  async create(pet: Omit<Pet, 'id' | 'createdAt'>): Promise<Pet> {
    const { data, error } = await supabase
      .from('pets')
      .insert({
        shelter_id:    pet.shelterId,
        name:          pet.name,
        species:       pet.species,
        breed:         pet.breed,
        age:           pet.age,
        gender:        pet.gender,
        size:          pet.size,
        description:   pet.description,
        image_url:     pet.imageUrl,
        is_vaccinated: pet.isVaccinated,
        is_sterilized: pet.isSterilized,
        status:        pet.status ?? 'disponible',
      })
      .select().single();
    if (error) throw new Error(error.message);
    return this._map(data);
  }

  async update(id: string, pet: Partial<Pet>): Promise<Pet> {
    const { data, error } = await supabase
      .from('pets')
      .update({
        name:          pet.name,
        species:       pet.species,
        breed:         pet.breed,
        age:           pet.age,
        gender:        pet.gender,
        size:          pet.size,
        description:   pet.description,
        image_url:     pet.imageUrl,
        is_vaccinated: pet.isVaccinated,
        is_sterilized: pet.isSterilized,
        status:        pet.status,
      })
      .eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return this._map(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('pets').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }

  private _map = (raw: any): Pet => ({
    id:           raw.id,
    shelterId:    raw.shelter_id,
    shelterName:  raw.profiles?.username ?? undefined,
    name:         raw.name,
    species:      raw.species,
    breed:        raw.breed ?? undefined,
    age:          raw.age ?? undefined,
    gender:       raw.gender,
    size:         raw.size,
    description:  raw.description ?? undefined,
    imageUrl:     raw.image_url ?? undefined,
    isVaccinated: raw.is_vaccinated ?? false,
    isSterilized: raw.is_sterilized ?? false,
    status:       raw.status,
    createdAt:    new Date(raw.created_at),
  });
}