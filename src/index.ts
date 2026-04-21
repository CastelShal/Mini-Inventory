import { config } from "dotenv";
import cookieParser from "cookie-parser";
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import { exit } from "node:process";
import { toNodeHandler } from "better-auth/node";
import { AuthError, extractSession } from "./middleware/auth.middleware.js";
import { categoryRouter } from "./categories/category.routes.js";
import { productRouter } from "./products/product.routes.js";
import { userRouter } from "./user/user.routes.js";
import { getDb } from "./db.js";
import { auth } from "./auth/better-auth.config.js";
import { uploadsDir } from "./middleware/upload.middleware.js";
import { ZodError } from "zod/v4";
import { SqliteError } from "better-sqlite3";
config()

const app = express();
const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "127.0.0.1";

app.use(helmet());
app.use(cookieParser());

app.all("/api/auth/*route", toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use("/users", extractSession, userRouter);
app.use("/products", extractSession, productRouter);
app.use("/categories", extractSession, categoryRouter);
app.use(express.static(uploadsDir));

app.use((error: Error, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ZodError) {
    console.error(error);
    return res.status(400).json({
      error: "Validation failed",
      details: error.flatten(),
    });
  }
  else if (error instanceof AuthError) {
    console.error(error);
    return res.status(error.statusCode).json({
      error: error.message,
    })
  }
  else if(error instanceof SqliteError){
    console.error(error);
    return res.status(422).send({
      error: "Some fields were unprocessable"
    })
  }
  console.error(error);
  res.status(500).json({ error: "Internal server error" });
});


try {
  getDb();
}
catch (error) {
  console.error("Database initialization failed\n", error);
  exit(1);
}

app.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
});


