import { Pool } from "pg";
import mysql from "mysql2/promise";
import Database from "better-sqlite3";
import { DatabaseConnection, QueryResult } from "../types/database";

export class QueryEngine {
    /**
     * Execute a SQL query against a user's database connection.
     */
    static async executeQuery(
        connection: DatabaseConnection,
        sql: string,
        params?: any[]
    ): Promise<QueryResult> {
        const start = Date.now();

        try {
            if (connection.db_type === "postgresql") {
                const pool = new Pool({
                    host: connection.host,
                    port: Number(connection.port),
                    user: connection.username,
                    password: connection.password,
                    database: connection.database,
                    ssl: { rejectUnauthorized: false },
                });

                const result = await pool.query(sql, params);
                await pool.end();

                return {
                    success: true,
                    data: result.rows,
                    columns: result.fields.map((f) => f.name),
                    row_count: result.rowCount ?? 0,
                    execution_time: Date.now() - start,
                };

                console.log(result.rows)
            }

            /* if (connection.db_type === "mysql") {
                const conn = await mysql.createConnection({
                    host: connection.host,
                    port: connection.port,
                    user: connection.username,
                    password: connection.password,
                    database: connection.database,
                });

                const [rows, fields] = await conn.execute(sql, params);
                await conn.end();

                return {
                    success: true,
                    data: Array.isArray(rows) ? rows : [],
                    columns: fields ? (fields as any[]).map((f) => f.name) : [],
                    row_count: Array.isArray(rows) ? rows.length : 0,
                    execution_time: Date.now() - start,
                };
            }

            if (connection.db_type === "sqlite") {
                const db = new Database(connection.database, {});
                const stmt = db.prepare(sql);
                const rows = stmt.all(params ?? []) as Record<string, any>[];
                db.close();

                const firstRow: Record<string, any> = rows.length > 0 ? rows[0] : {};
                const columns = Object.keys(firstRow);

                return {
                    success: true,
                    data: rows,
                    columns,
                    row_count: rows.length,
                    execution_time: Date.now() - start,
                };
            } */

            return {
                success: false,
                error: `Unsupported DB type: ${connection.db_type}`,
            };
        } catch (err: any) {
            return {
                success: false,
                error: err.message,
            };
        }
    }
}