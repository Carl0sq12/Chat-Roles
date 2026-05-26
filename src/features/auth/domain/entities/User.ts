export type UserRole = 'vendedor' | 'cliente';

export interface User {
    id:        string;
    email:     string;
    username:  string;
    avatarUrl?: string;
    role:      UserRole;  // ← NUEVO
}