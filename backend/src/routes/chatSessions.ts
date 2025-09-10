import { Router, Request, Response } from "express";
import { ChatRepository } from "../services/ChatRepository";
import { SqlGenerator } from "../services/SqlGenerator";
import { QueryEngine } from "../services/QueryEngine";
import { ConnectionManager } from "../services/ConnectionManager";
import { ChatRequest } from "../types/chat";

const router = Router();


/**
 * Start a new chat session linked to a DB connection.
 */
router.post("/session", async (req: Request, res: Response) => {
    try {
        const { database_connection_id, title } = req.body;
        const session = await ChatRepository.createSession(database_connection_id, title);
        res.json({ success: true, data: session });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/**
 * Send a chat message (user prompt → SQL → execute → store → respond).
 */
router.post("/", async (req: Request, res: Response) => {
    try {
        const payload = req.body as ChatRequest;

        // Get or create chat session
        let sessionId = payload.session_id;
        if (!sessionId) {
            const session = await ChatRepository.createSession(payload.database_connection_id);
            sessionId = session.id;
        }

        // Save user message
        await ChatRepository.addMessage(sessionId, "user", payload.message);

        // Retrieve connection (with decrypted password)
        const connection = await ConnectionManager.getConnectionById(payload.database_connection_id);
        if (!connection) {
            return res.status(404).json({ success: false, message: "Database connection not found" });
        }

        // Generate SQL from user prompt
        const sql = await SqlGenerator.generateSQL(payload.message);

        // Execute query
        const queryResult = await QueryEngine.executeQuery(connection, sql);

        // Save assistant response
        await ChatRepository.addMessage(sessionId, "assistant", sql, queryResult);

        res.json({
            success: true,
            session_id: sessionId,
            message: sql,
            query_result: queryResult,
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/**
 * Get chat history for a session.
 */
router.get("/session/:id", async (req: Request, res: Response) => {
    try {
        const messages = await ChatRepository.getMessages(req.params.id);
        res.json({ success: true, data: messages });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;