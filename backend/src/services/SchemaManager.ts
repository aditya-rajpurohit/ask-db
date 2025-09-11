import { Pool } from "pg";
import { DatabaseSchema } from "../types/schema";

export async function getSchema(pool: Pool): Promise<DatabaseSchema> {
    const columnRes = await pool.query(`
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position;
  `);

    const fkRes = await pool.query(`
        SELECT
            tc.table_name AS table_name,
            kcu.column_name AS column_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        WHERE constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public';
  `);

    const tables: Record<string, string[]> = {};
    columnRes.rows.forEach((row) => {
        if (!tables[row.table_name]) tables[row.table_name] = [];
        tables[row.table_name].push(row.column_name);
    });

    const relationships = fkRes.rows.map((row) => ({
        fromTable: row.table_name,
        fromColumn: row.column_name,
        toTable: row.foreign_table_name,
        toColumn: row.foreign_column_name,
    }));

    return {
        tables: Object.entries(tables).map(([name, columns]) => ({ name, columns })),
        relationships,
    };
}