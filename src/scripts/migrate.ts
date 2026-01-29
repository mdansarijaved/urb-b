import "dotenv/config";
import { readFileSync } from "fs";
import { join } from "path";
import { db } from "../lib/db.js";


async function migrate() {
    const schemaPath = join(process.cwd(), "src/schema/link.sql");
    const sql = readFileSync(schemaPath, "utf-8");

    try {
        await db.query(sql);
        console.log("✅ Migration successful: link table created");
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    } finally {
        await db.end();
    }
}

migrate();