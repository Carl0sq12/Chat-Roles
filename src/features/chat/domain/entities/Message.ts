export interface Message {
    id: string;
    roomId: string;
    userId: string;
    content: string;
    createdAt: Date;      // era createAt
    authorUsername?: string;
    imageUrl?: string; 
}

export interface Room {
    id: string;
    name: string;
    createdBy: string;
    createdAt: Date;      // era createAt
}