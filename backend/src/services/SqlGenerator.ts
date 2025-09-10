import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export class SqlGenerator {
    /**
     * Generate SQL from a natural language prompt.
     */
    static async generateSQL(
        prompt: string,
        schemaInfo?: { tables: string[] }
    ): Promise<string> {
        const schemaContext = schemaInfo
            ? `The database has the following tables: ${schemaInfo.tables.join(", ")}.`
            : "";

        const systemPrompt = `
            You are an expert SQL generator.
            Convert user questions into valid SQL queries.
            Respond with only SQL, nothing else.
        `;

        const userPrompt = `${schemaContext}\nUser request: ${prompt}`;

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0,
        });

        const sql = response.choices[0].message?.content?.trim() ?? "";

        return sql;
    }
}