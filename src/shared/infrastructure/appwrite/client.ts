import { Client, Account, Databases, Storage } from 'appwrite';
import { Platform } from 'react-native';

// Fix: Appwrite Realtime usa localStorage pero React Native no lo tiene
if (Platform.OS !== 'web') {
  const _storage: Record<string, string> = {};
  (global as any).localStorage = {
    getItem:    (key: string) => _storage[key] ?? null,
    setItem:    (key: string, value: string) => { _storage[key] = value; },
    removeItem: (key: string) => { delete _storage[key]; },
    clear:      () => { Object.keys(_storage).forEach(k => delete _storage[k]); },
  };
}

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

export const account        = new Account(client);
export const databases      = new Databases(client);
export const appwriteClient = client;
export const storage        = new Storage(client);