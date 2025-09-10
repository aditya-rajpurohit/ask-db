import { query } from "../infra/connection";
import { DatabaseConnection, DatabaseConnectionRequest, DatabaseTestResult } from "../types/database";
import { Pool } from "pg";
import mysql from "mysql2/promise";
import Database from "better-sqlite3";

const SECRET_KEY = process.env.APP_SECRET_KEY || "default_secret";


export class ConnectionManager {
    /**
     * Save a new DB connection into the app database.
     */
    static async createConnection(req: DatabaseConnectionRequest): Promise<DatabaseConnection> {
        const sql = `
      INSERT INTO database_connections 
        (name, host, port, database, username, password, db_type, is_active) 
      VALUES 
        ($1, $2, $3, $4, $5, encrypt_password($6, $7), $8, true)
      RETURNING *;
    `;

        const result = await query<DatabaseConnection>(sql, [
            req.name,
            req.host,
            req.port,
            req.database,
            req.username,
            req.password,
            SECRET_KEY,
            req.db_type,
        ]);

        return result.rows[0];
    }

    /**
     * Get a connection by its ID.
     */
    static async getConnectionById(id: string): Promise<DatabaseConnection | null> {
        const result = await query<DatabaseConnection>(
            "SELECT *, decrypt_password(password, $2) as password FROM database_connections WHERE id = $1 AND is_active = true",
            [id, SECRET_KEY]
        );
        return result.rows[0] || null;
    }

    /**
     * Get all active connections.
     */
    static async listConnections(): Promise<DatabaseConnection[]> {
        const result = await query<DatabaseConnection>(
            "SELECT id, name, host, port, database, username, db_type, is_active, created_at, updated_at FROM database_connections WHERE is_active = true"
        );
        return result.rows;
    }

    /**
     * Test if provided connection details are valid.
     */
    static async testConnection(req: DatabaseConnectionRequest): Promise<DatabaseTestResult> {
        try {
            if (req.db_type === "postgresql") {
                const testPool = new Pool({
                    host: req.host,
                    port: req.port,
                    user: req.username,
                    password: req.password,
                    database: req.database,
                    ssl: false,
                });
                await testPool.query("SELECT 1");
                await testPool.end();

                return { success: true, message: "Postgres connection successful" };
            }

            if (req.db_type === "mysql") {
                const conn = await mysql.createConnection({
                    host: req.host,
                    port: req.port,
                    user: req.username,
                    password: req.password,
                    database: req.database,
                });
                await conn.query("SELECT 1");
                await conn.end();

                return { success: true, message: "MySQL connection successful" };
            }

            if (req.db_type === "sqlite") {
                const db = new Database(req.database, { readonly: true });
                db.prepare("SELECT 1").get();
                db.close();

                return { success: true, message: "SQLite connection successful" };
            }

            return { success: false, message: "Unsupported database type" };
        } catch (err: any) {
            return { success: false, message: err.message };
        }
    }
}