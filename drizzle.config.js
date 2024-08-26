import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "src/lib/db/schema.js",
  out: "src/lib/db",
  dbCredentials: {
    url: process.env.PUBLIC_DATABASE_URL,
  }
});
