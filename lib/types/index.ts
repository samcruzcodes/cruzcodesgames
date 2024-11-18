// Shared types across both frontend and backend!

export type User = {
    id: string; 
    username: string;
    email: string;
    createdAt: string;
    };

export type Game = {
    id: string; 
    title: string;
    description: string;
    thumbnailUrl: string; 
    itchIoUrl: string; 
    likes: number;
    views: number;
    height: string;
    width: string;
    margin: string;
};

export type Comment = {
    id: string; 
    gameId: string; 
    userId: string; 
    username: string;
    content: string; 
    createdAt: string; 
};