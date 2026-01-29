import { redis } from "../config/redis.js";
import { z } from "zod"
import type { User } from "better-auth/types"
import { db } from "../lib/db.js";

const URL_REDIS_PREFIX = "shorturl:"

const TTL = 60 * 60 * 24;



const urlSchema = z.object({
    url: z.url({
        protocol: /^https?$/
    }),
    code: z.string()
})


export const urlService = {
    async getLongURL(code: string) {

        const cacheKey = `${URL_REDIS_PREFIX}${code}`
        const url = await redis.get(cacheKey)

        if (url) {
            return url;
        }
        const result = await db.query('SELECT "originalUrl" FROM "link" WHERE "shortCode" = $1', [code])
        const link = result.rows[0];

        if (!link) {
            return null;
        }

        await redis.set(cacheKey, link.originalUrl, "EX", TTL);

        return link.originalUrl;
    },

    async createShortURL(url: string, code: string, user?: User | null) {

        const parsed = urlSchema.parse({ url, code })
        const cacheKey = `${URL_REDIS_PREFIX}${code}`

        await redis.set(cacheKey, url, "EX", TTL)
        await db.query('INSERT INTO "link"("originalUrl", "shortCode", "userId" ) VALUES($1, $2, $3)', [parsed.url, parsed.code, user?.id])
    },

    async getUserURls(userId?: string) {

        const result = await db.query('SELECT "name", "email", "originalUrl", "shortCode", "link"."createdAt" FROM "user" JOIN "link" ON "user"."id" = "link"."userId" WHERE "user"."id" = $1 ', [userId])

        const userUrl = result.rows;

        return userUrl;

    }
}