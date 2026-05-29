export type RequestStatus = 'pendiente' | 'aprobada' | 'rechazada';

export interface AdoptionRequest {
  id:          string;
  petId:       string;
  petName?:    string;
  petImage?:   string;
  adopterId:   string;
  adopterName?: string;
  shelterId:   string;
  message?:    string;
  status:      RequestStatus;
  createdAt:   Date;
}