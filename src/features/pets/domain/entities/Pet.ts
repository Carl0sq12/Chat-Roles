export type PetSpecies  = 'perro' | 'gato' | 'conejo' | 'ave' | 'otro';
export type PetGender   = 'macho' | 'hembra';
export type PetSize     = 'pequeño' | 'mediano' | 'grande';
export type PetStatus   = 'disponible' | 'en_proceso' | 'adoptado';

export interface Pet {
  id:          string;
  shelterId:   string;
  shelterName?: string;
  name:        string;
  species:     PetSpecies;
  breed?:      string;
  age?:        number;
  gender:      PetGender;
  size:        PetSize;
  description?: string;
  imageUrl?:   string;
  isVaccinated: boolean;
  isSterilized: boolean;
  status:      PetStatus;
  createdAt:   Date;
}