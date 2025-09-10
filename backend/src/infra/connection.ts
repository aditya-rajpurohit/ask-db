import { Pool, QueryResult, QueryResultRow } from "pg";

const pool = new Pool({
    host: process.env.APP_DB_HOST || "localhost",
    port: Number(process.env.APP_DB_PORT) || 5432,
    user: process.env.APP_DB_USER || "postgres",
    password: process.env.APP_DB_PASSWORD || "postgres",
    database: process.env.APP_DB_NAME || "db_ai_assistant",
    ssl: process.env.APP_DB_SSL === "true" ? { rejectUnauthorized: false } : false,
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