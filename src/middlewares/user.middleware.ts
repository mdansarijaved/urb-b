
import type { NextFunction, Request, Response } from "express";
import { auth } from "../auth";
import { fromNodeHeaders } from "better-auth/node";

export async function attachUser(req: Request, res: Response, next: NextFunction) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        req.user = session?.user || null;
        next();
    } catch (err) {
        next(err);
    }
}
