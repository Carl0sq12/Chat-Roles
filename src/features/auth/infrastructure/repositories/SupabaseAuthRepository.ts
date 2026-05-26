import { supabase } from "../../../../shared/infrastructure/supabase/client";
import { User, UserRole } from "../../domain/entities/User";
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";

export class SupabaseAuthRepository implements IAuthRepository {

  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) throw new Error(error?.message ?? 'Error al iniciar sesión');

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('username, avatar_url, role')
      .eq('id', data.user.id)
      .single();

    if (profileError) console.warn('Profile fetch error:', profileError.message);

    return {
      id:        data.user.id,
      email:     data.user.email!,
      username:  profile?.username ?? data.user.user_metadata?.username ?? '',
      avatarUrl: profile?.avatar_url ?? undefined,
      role:      (profile?.role ?? 'cliente') as UserRole,
    };
  }

  async register(
    email: string,
    password: string,
    username: string,
    role: UserRole,
  ): Promise<User> {
    // 1. Crear usuario en Supabase Auth — pasar role Y display_name en metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          role,                  // ← el trigger lo lee de raw_user_meta_data
          display_name: username, // ← aparece en Supabase Auth dashboard
        },
      },
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('No se pudo crear el usuario');

    // 2. Upsert en profiles por si el trigger ya insertó sin el role correcto
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        { id: data.user.id, username, role },
        { onConflict: 'id' },   // ← si el trigger ya corrió, actualiza el role
      );

    if (profileError) throw new Error(profileError.message);

    return {
      id:       data.user.id,
      email:    data.user.email!,
      username,
      role,
    };
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('username, avatar_url, role')
      .eq('id', user.id)
      .single();

    if (error) console.warn('getCurrentUser profile error:', error.message);

    return {
      id:        user.id,
      email:     user.email!,
      username:  profile?.username ?? user.user_metadata?.username ?? '',
      avatarUrl: profile?.avatar_url ?? undefined,
      role:      (profile?.role ?? 'cliente') as UserRole,
    };
  }
}