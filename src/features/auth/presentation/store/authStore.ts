import { create } from 'zustand';
import { User } from '../../domain/entities/User';

interface AuthState {
    user: User | null;
    setUser: (user: User | null) => void;
    isVendedor: () => boolean;  // ← helper de conveniencia
    isCliente:  () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    setUser: (user) => set({ user }),
    isVendedor: () => get().user?.role === 'vendedor',
    isCliente:  () => get().user?.role === 'cliente',
}));