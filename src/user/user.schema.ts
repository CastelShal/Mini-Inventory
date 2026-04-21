import { z } from "zod";

export const modifyUserSchema = z.object({
  role: z.enum(["admin", "vendor", "customer"]),
});

