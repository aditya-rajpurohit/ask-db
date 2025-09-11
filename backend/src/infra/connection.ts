import { Pool, QueryResult, QueryResultRow } from "pg";
import { ENV } from "../config/env";

const pool = new Pool({
    host: ENV.APP_DB_HOST || "localhost",
    port: ENV.APP_DB_PORT || 5432,
    user: ENV.APP_DB_USER || "postgres",
    password: ENV.APP_DB_PASSWORD || "postgres",
    database: ENV.APP_DB_NAME || "db_ai_assistant",
    ssl: ENV.APP_DB_SSL ? { rejectUnauthorized: false } : false,
});

export const query = async <T extends QueryResultRow = any>(
    text: string,
    params?: any[]
): Promise<QueryResult<T>> => {
    try {
        return await pool.query<T>(text, params);
    } catch (err) {
        console.error("App DB Query Error:", err);
        throw err;
    }
};

export default pool;