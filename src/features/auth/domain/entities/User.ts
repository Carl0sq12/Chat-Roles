export type UserRole = 'refugio' | 'adoptante';

export interface User {
  id:             string;
  email:          string;
  username:       string;
  avatarUrl?:     string;
  role:           UserRole;
  shelterName?:   string;
  shelterAddress?:string;
  shelterPhone?:  string;
  latitude?:      number;
  longitude?:     number;
}