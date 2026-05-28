import { account, databases } from '@shared/infrastructure/appwrite/client';
import { ID, Query } from 'appwrite';
import { User, UserRole } from '@features/auth/domain/entities/User';
import { IAuthRepository } from '@features/auth/domain/repositories/IAuthRepository';

const DB_ID       = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const PROFILES_ID = process.env.EXPO_PUBLIC_APPWRITE_PROFILES_COLLECTION!;

export class AppwriteAuthRepository implements IAuthRepository {

  async login(email: string, password: string): Promise<User> {
    
    try {
      await account.deleteSession('current');
    } catch {
    
    }

    await account.createEmailPasswordSession(email, password);
    const aw = await account.get();

    const result = await databases.listDocuments(DB_ID, PROFILES_ID, [
      Query.equal('userId', aw.$id),
    ]);
    const profile = result.documents[0];

    return {
      id:        aw.$id,
      email:     aw.email,
      username:  profile?.username ?? aw.name ?? '',
      avatarUrl: profile?.avatarUrl ?? undefined,
      role:      (profile?.role ?? 'cliente') as UserRole,
    };
  }

  async register(
    email: string,
    password: string,
    username: string,
    role: UserRole,
  ): Promise<User> {
    // Cerrar sesión existente antes de registrar
    try {
      await account.deleteSession('current');
    } catch {
      // No había sesión activa, ignorar
    }

    const aw = await account.create(ID.unique(), email, password, username);
    await account.createEmailPasswordSession(email, password);

    await databases.createDocument(DB_ID, PROFILES_ID, ID.unique(), {
      userId: aw.$id,
      username,
      role,
    });

    return { id: aw.$id, email: aw.email, username, role };
  }

  async logout(): Promise<void> {
    try {
      await account.deleteSession('current');
    } catch {
      // Ignorar si ya no hay sesión
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const aw = await account.get();
      const result = await databases.listDocuments(DB_ID, PROFILES_ID, [
        Query.equal('userId', aw.$id),
      ]);
      const profile = result.documents[0];

      return {
        id:        aw.$id,
        email:     aw.email,
        username:  profile?.username ?? aw.name ?? '',
        avatarUrl: profile?.avatarUrl ?? undefined,
        role:      (profile?.role ?? 'cliente') as UserRole,
      };
    } catch {
      return null;
    }
  }
}


// SUPABASE
//const { data, error } = await supabase.auth.signInWithPassword({ email, password })

// APPWRITE
//await account.createEmailPasswordSession(email, password)
//const aw = await account.get()

// SUPABASE
//supabase.channel(`room:${roomId}`).on('postgres_changes', ...)

// APPWRITE
//appwriteClient.subscribe(`databases.${DB_ID}.collections...`, ...)
