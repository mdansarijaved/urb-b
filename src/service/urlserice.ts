import { redis } from "../config/redis";
import { prisma } from "../lib/prisma";
import { z } from "zod"
import type { User } from "better-auth/types"

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

        const link = await prisma.link.findUnique({
            where: {
                shortCode: code
            },
            select: {
                originalUrl: true
            }
        })

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

        await prisma.link.create({
            data: {
                originalUrl: parsed.url,
                shortCode: parsed.code,
                userId: user?.id ?? null
            }
        })
    }
}