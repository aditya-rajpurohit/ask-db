import OpenAI from "openai";
import { ENV } from "../config/env";
import { cleanSQL } from "../utils/CodeFormatterUtil";
import { DatabaseSchema } from "../types/schema";

export class SqlGenerator {
    /**
     * Generate SQL from a natural language prompt.
     */
    static async generateSQL(
        prompt: string,
        schemaInfo?: DatabaseSchema
    ): Promise<string> {
        const client = new OpenAI({
            apiKey: ENV.OPENAI_API_KEY,
        });

        // Build schema context string
        const schemaContext = schemaInfo
            ? [
                ...schemaInfo.tables.map(
                    (t) => `Table "${t.name}" has columns: ${t.columns.join(", ")}.`
                ),
                ...(schemaInfo.relationships || []).map(
                    (r) =>
                        `Relationship: "${r.fromTable}.${r.fromColumn}" → "${r.toTable}.${r.toColumn}".`
                ),
            ].join("\n")
            : "";

        const systemPrompt = `
            You are an expert SQL generator.
            
            Database schema: ${schemaContext}

            Your task:
                - Convert user questions into valid SQL queries for the given database schema.
                - Return only a valid SQL query string. 
                - Do not include explanations, comments, or Markdown formatting (no \`\`\`sql fences).

            Guidelines:
                1. Always write SQL that provides meaningful, human-readable results:
                    - Prefer descriptive columns (e.g., customer name, product name, order date) instead of just IDs.
                    - When aggregating, include both the aggregate value and identifying columns (e.g., customer name + total sales).
                    - Alias column names into clear, business-friendly labels (e.g., "SUM(quantity)" → "Total Quantity").
                2. Consider the intent behind the business problem:
                    - If the user asks for "top customers," show their names and key attributes along with metrics.
                    - If the user asks for "most popular products," include product name and category, not just product_id.
                    - For order-related insights, return order_date, customer, and product info where relevant.
                3. Limit results to 10 rows unless the user explicitly asks for more.
                4. Only output SQL. Never include natural language commentary.
                5. Use only the listed columns — do not invent new columns.
                6. When computing "total sales", "total revenue", or "total value":
                    - Always calculate it as SUM(orders.quantity * products.price).
                    - Alias it as "total_value".
                7. Use relationships to join tables correctly.
                8. Alias columns into business-friendly names.
        `;

        const userPrompt = `User request: ${prompt}`;

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0,
        });

        const raw = response.choices[0].message?.content?.trim() ?? "";
        const sql = cleanSQL(raw);

        return sql;
    }
}