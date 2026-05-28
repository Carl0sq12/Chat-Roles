import { databases, appwriteClient } from '@shared/infrastructure/appwrite/client';
import { ID, Query } from 'appwrite';
import { Message, Room } from '@features/chat/domain/entities/Message';
import { IChatRepository } from '@features/chat/domain/repositories/IChatRepository';

const DB_ID        = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const ROOMS_COL    = process.env.EXPO_PUBLIC_APPWRITE_ROOMS_COLLECTION!;
const MSGS_COL     = process.env.EXPO_PUBLIC_APPWRITE_MESSAGES_COLLECTION!;
const PROFILES_COL = process.env.EXPO_PUBLIC_APPWRITE_PROFILES_COLLECTION!;

export class AppwriteChatRepository implements IChatRepository {

  async getRooms(): Promise<Room[]> {
    const res = await databases.listDocuments(DB_ID, ROOMS_COL, [
      Query.orderDesc('$createdAt'),
    ]);
    return res.documents.map(this.mapRoom);
  }

  async createRoom(name: string, userId: string): Promise<Room> {
    const doc = await databases.createDocument(DB_ID, ROOMS_COL, ID.unique(), {
      name,
      createdBy: userId,
    });
    return this.mapRoom(doc);
  }

  async getMessages(roomId: string): Promise<Message[]> {
    const res = await databases.listDocuments(DB_ID, MSGS_COL, [
      Query.equal('roomId', roomId),
      Query.orderAsc('$createdAt'),
      Query.limit(50),
    ]);
    return res.documents.map(this.mapMessage);
  }

  async sendMessage(
    roomId: string,
    userId: string,
    content: string,
    imageUrl?: string,
  ): Promise<Message> {
    let authorUsername = '';
    try {
      const profileResult = await databases.listDocuments(DB_ID, PROFILES_COL, [
        Query.equal('userId', userId),
      ]);
      authorUsername = profileResult.documents[0]?.username ?? '';
    } catch {
      // Si falla el mensaje igual se envía
    }

    const doc = await databases.createDocument(DB_ID, MSGS_COL, ID.unique(), {
      roomId,
      userId,
      content,
      imageUrl:       imageUrl ?? null,
      authorUsername,
    });
    return this.mapMessage(doc);
  }

  subscribeToRoom(roomId: string, onMessage: (msg: Message) => void): () => void {
    const channel = `databases.${DB_ID}.collections.${MSGS_COL}.documents`;

    const unsubscribe = appwriteClient.subscribe(channel, (response: any) => {
      const isCreate = response.events?.some((e: string) => e.includes('.create'));
      if (!isCreate) return;

      const doc = response.payload;
      if (doc.roomId !== roomId) return;

      onMessage(this.mapMessage(doc));
    });

    return unsubscribe;
  }

  private mapRoom = (doc: any): Room => ({
    id:        doc.$id,
    name:      doc.name,
    createdBy: doc.createdBy,
    createdAt: new Date(doc.$createdAt),
  });

  private mapMessage = (doc: any): Message => ({
    id:             doc.$id,
    roomId:         doc.roomId,
    userId:         doc.userId,
    content:        doc.content,
    createdAt:      new Date(doc.$createdAt),
    authorUsername: doc.authorUsername ?? undefined,
    imageUrl:       doc.imageUrl ?? undefined,
  });
}