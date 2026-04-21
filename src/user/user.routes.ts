import { Router } from "express";
import { getUsers, modifyUser} from "./user.controller.js";
import { ensureRoles } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", ensureRoles(["admin"]), getUsers);
userRouter.patch("/:id/role", ensureRoles(["admin"]), modifyUser);

export { userRouter };
