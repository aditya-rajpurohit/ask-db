import { QueryResult } from "./database";

export interface ChatSession {
    id: string;
    database_connection_id: string;
    title: string;
    created_at: Date;
    updated_at: Date;
}

export interface ChatMessage {
    id: string;
    session_id: string;
    role: 'user' | 'assistant';
    content: string;
    query_result?: QueryResult;
    created_at: Date;
}

export interface ChatRequest {
    message: string;
    session_id?: string;
    database_connection_id: string;
}

export interface ChatResponse {
    success: boolean;
    message: string;
    query_result?: QueryResult;
    session_id: string;
}