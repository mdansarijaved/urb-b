import { betterAuth, type Auth } from "better-auth";
import { db } from "./lib/db.js";
export const auth: Auth = betterAuth({
  basePath: "/api/v1/auth",
  database: db,
  trustedOrigins: ["http://localhost:3000"],
  advanced: { disableOriginCheck: true },
  emailAndPassword: {
    enabled: true,
  },
});
