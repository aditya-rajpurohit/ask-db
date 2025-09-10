import { Router, Request, Response } from "express";
import { ConnectionManager } from "../services/ConnectionManager";
import { DatabaseConnectionRequest } from "../types/database";

const router = Router();

/**
 * Test a database connection without saving it.
 */
router.post("/test", async (req: Request, res: Response) => {
    try {
        const payload = req.body as DatabaseConnectionRequest;
        const result = await ConnectionManager.testConnection(payload);
        res.json(result);
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/**
 * Save a new database connection.
 */
router.post("/", async (req: Request, res: Response) => {
    try {
        const payload = req.body as DatabaseConnectionRequest;
        const connection = await ConnectionManager.createConnection(payload);
        res.json({ success: true, data: connection });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/**
 * Get all active connections.
 */
router.get("/", async (_req: Request, res: Response) => {
    try {
        const connections = await ConnectionManager.listConnections();
        res.json({ success: true, data: connections });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;