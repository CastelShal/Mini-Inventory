export const roles = ["admin", "vendor", "customer"] as const
export type Role = typeof roles[number]