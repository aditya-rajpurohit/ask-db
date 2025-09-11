import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const ENV = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",

    APP_DB_HOST: process.env.APP_DB_HOST ?? "localhost",
    APP_DB_PORT: Number(process.env.APP_DB_PORT ?? 5432),
    APP_DB_NAME: process.env.APP_DB_NAME ?? "db_ai_assistant",
    APP_DB_USER: process.env.APP_DB_USER ?? "postgres",
    APP_DB_PASSWORD: process.env.APP_DB_PASSWORD ?? "postgres",
    APP_DB_SSL: process.env.APP_DB_SSL === "true",

    APP_SECRET_KEY: process.env.APP_SECRET_KEY ?? "local-secret-key",
    PORT: Number(process.env.PORT ?? 4000),
};