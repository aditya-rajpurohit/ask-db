import cors from "cors";
import express from "express";
import dbConnectionsRouter from "./routes/dbConnections";
import chatSessionsRouter from "./routes/chatSessions";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
app.use(express.json());

app.use(cors({ origin: "http://localhost:3000" }));

// Routes
app.use("/db-connections", dbConnectionsRouter);
app.use("/chat-sessions", chatSessionsRouter);

// Health check
app.get("/health", (_req, res) => {
    res.json({ success: true, message: "Backend is running 🚀" });
});

// Error handler (keep last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`⚡ Backend running on http://localhost:${PORT}`);
});