/**
 * Clean raw SQL text returned by the LLM.
 * Removes Markdown code fences (```sql ... ```), trims whitespace.
 */

export function cleanSQL(raw: string): string {
    if (!raw) return "";

    return raw
        .replace(/```sql/gi, "")   // remove ```sql (case-insensitive)
        .replace(/```/g, "")       // remove ```
        .trim();                   // trim whitespace/newlines
}