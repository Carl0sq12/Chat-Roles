import { create } from 'zustand';
import { User } from '../../domain/entities/User';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  isRefugio:   () => boolean;
  isAdoptante: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  isRefugio:   () => get().user?.role === 'refugio',
  isAdoptante: () => get().user?.role === 'adoptante',
}));