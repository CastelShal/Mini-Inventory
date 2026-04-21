import { type NextFunction, type Request, type Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from '../auth/better-auth.config.js'
import type { Auth, AuthSession } from "../auth/better-auth.config.js";
import { IncomingHttpHeaders } from "http";
import { Role } from "../user/roles.js";

export class AuthError extends Error {
  statusCode: number

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}

// Infer user and session types from Auth
export interface AuthenticatedRequest extends Request {
  session?: AuthSession
}

async function getSessionFromHeaders(headers: IncomingHttpHeaders): Promise<AuthSession | null> {
  return auth.api.getSession({
    headers: fromNodeHeaders(headers)
  })
}

export async function extractSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const session = await getSessionFromHeaders(req.headers)

  if (!session) {
    next(new AuthError("Unauthorized Request"));
    return
  }

  req.session = session;
  next();
};

export function ensureRoles(roles: Role[]) {
  return async function (req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (roles.length == 0) {
      next();
    }

    const userRole = req.session?.user.role

    if (!userRole || roles.indexOf(userRole as Role) === -1) {
      next(new AuthError("User has insufficient permissions"))
      return
    }

    next()
  }
}
