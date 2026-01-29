import "dotenv/config";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { db } from "../lib/db.js";

async function runMigration(name: string, sql: string) {
    try {
        await db.query(sql);
        console.log(`✅ Migration successful: ${name}`);
    } catch (error: unknown) {
        const err = error as { code?: string; message?: string };
        if (err.code === "42P07") {
            console.log(`⏭️  Skipping ${name} (already exists)`);
        } else {
            console.error(`❌ Migration failed: ${name}`, error);
            throw error;
        }
    }
}

async function migrate() {
    try {
        const betterAuthMigrationsDir = join(process.cwd(), "src/better-auth_migrations");
        const migrationFiles = readdirSync(betterAuthMigrationsDir)
            .filter(file => file.endsWith(".sql"))
            .sort();

        console.log("Running Better Auth migrations...");
        for (const file of migrationFiles) {
            const filePath = join(betterAuthMigrationsDir, file);
            const sql = readFileSync(filePath, "utf-8");
            await runMigration(`Better Auth: ${file}`, sql);
        }

        console.log("Running link table migration...");
        const linkSchemaPath = join(process.cwd(), "src/schema/link.sql");
        const linkSql = readFileSync(linkSchemaPath, "utf-8");
        await runMigration("link table", linkSql);

        console.log("✅ All migrations completed successfully");
    } catch (error) {
        console.error("❌ Migration process failed:", error);
        process.exit(1);
    } finally {
        await db.end();
    }
}

migrate();