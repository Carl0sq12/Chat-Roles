import { supabase } from '@shared/infrastructure/supabase/client';
import { User, UserRole } from '../../domain/entities/User';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class SupabaseAuthRepository implements IAuthRepository {

  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) throw new Error(error?.message ?? 'Error al iniciar sesión');
    return this._fetchProfile(data.user.id, data.user.email!);
  }

  async loginWithGoogle(): Promise<User> {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) throw new Error(error.message);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No se pudo obtener el usuario');
    return this._fetchProfile(user.id, user.email!);
  }

  async register(
    email: string,
    password: string,
    username: string,
    role: UserRole,
    extra?: Record<string, any>
  ): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { username, role, display_name: username } },
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('No se pudo crear el usuario');

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ id: data.user.id, username, role, ...extra }, { onConflict: 'id' });
    if (profileError) throw new Error(profileError.message);

    return { id: data.user.id, email: data.user.email!, username, role, ...extra };
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://TU_SITIO.vercel.app/reset-password',
    });
    if (error) throw new Error(error.message);
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return this._fetchProfile(user.id, user.email!);
  }

  private async _fetchProfile(userId: string, email: string): Promise<User> {
    const { data: p } = await supabase
      .from('profiles').select('*').eq('id', userId).single();
    return {
      id:             userId,
      email,
      username:       p?.username ?? '',
      avatarUrl:      p?.avatar_url ?? undefined,
      role:           (p?.role ?? 'adoptante') as UserRole,
      shelterName:    p?.shelter_name ?? undefined,
      shelterAddress: p?.shelter_address ?? undefined,
      shelterPhone:   p?.shelter_phone ?? undefined,
      latitude:       p?.latitude ?? undefined,
      longitude:      p?.longitude ?? undefined,
    };
  }
}