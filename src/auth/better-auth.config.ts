import { betterAuth } from "better-auth";
import { admin as adminPlugin, createAccessControl, Role } from "better-auth/plugins";
import { getDb } from "../db.js";
import { defaultStatements } from "better-auth/plugins/admin/access";
import { createAuthMiddleware } from "better-auth/api";
import { actions, createAuditLog } from "../audit_logger/audit_logs.js";

const ac = createAccessControl(defaultStatements);

export const admin = ac.newRole({ user: [] })
export const vendor = ac.newRole({ user: [] })
export const customer = ac.newRole({ user: [] })

export const auth = betterAuth({
    database: getDb(),
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    secret: process.env.AUTH_SECRET || "dev-auth-secret-change-me-in-production",
    emailAndPassword: {
        enabled: true,
    },
    advanced: {
        disableOriginCheck: true
    },
    hooks: {
        after: createAuthMiddleware(async ctx => {
            if (ctx.path.startsWith("/sign-up")) {
                const newSession = ctx.context.newSession;
                if (newSession) {
                    createAuditLog(newSession.user.id, newSession.user.id, actions.newUserRegister);
                }
            }
        })
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 1 days
        updateAge: 60 * 60 * 24, // Update session every 24 hours
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // 5 minutes
        },
    },
    plugins: [
        adminPlugin({
            ac,
            adminUserIds: ["lwqOc4tQc7GFI25pUazFjQbJ0ySVRiBa"],
            roles: {
                admin,
                customer,
                vendor
            },
            defaultRole: "customer"
        }),
    ],
});

export type Auth = typeof auth
export type AuthSession = typeof auth.$Infer.Session

