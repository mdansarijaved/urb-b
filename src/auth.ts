import { betterAuth, type Auth } from "better-auth";
import { Pool } from 'pg';
import { db } from "./lib/db";
export const auth: Auth = betterAuth({
  basePath: "/api/v1/auth",
  database: db,
  trustedOrigins: ["http://localhost:3000"],
  // use for postman
  advanced: {
    disableOriginCheck: true
  },
  emailAndPassword: {
    enabled: true,
  },
});
