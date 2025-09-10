import { query } from "../infra/connection";
import { ChatSession, ChatMessage } from "../types/chat";

export class ChatRepository {
    /**
     * Create a new chat session for a given DB connection.
     */
    static async createSession(databaseConnectionId: string, title = "New Chat"): Promise<ChatSession> {
        const sql = `
      INSERT INTO chat_sessions (database_connection_id, title)
      VALUES ($1, $2)
      RETURNING *;
    `;
        const result = await query<ChatSession>(sql, [databaseConnectionId, title]);
        return result.rows[0];
    }

    /**
     * Get an existing chat session by ID.
     */
    static async getSessionById(sessionId: string): Promise<ChatSession | null> {
        const sql = `SELECT * FROM chat_sessions WHERE id = $1`;
        const result = await query<ChatSession>(sql, [sessionId]);
        return result.rows[0] || null;
    }

    /**
     * Store a chat message in a session.
     */
    static async addMessage(
        sessionId: string,
        role: "user" | "assistant",
        content: string,
        queryResult?: any
    ): Promise<ChatMessage> {
        const sql = `
      INSERT INTO chat_messages (session_id, role, content, query_result)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
        const result = await query<ChatMessage>(sql, [
            sessionId,
            role,
            content,
            queryResult || null,
        ]);
        return result.rows[0];
    }

    /**
     * Get all messages for a given session.
     */
    static async getMessages(sessionId: string): Promise<ChatMessage[]> {
        const sql = `SELECT * FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC`;
        const result = await query<ChatMessage>(sql, [sessionId]);
        return result.rows;
    }
}