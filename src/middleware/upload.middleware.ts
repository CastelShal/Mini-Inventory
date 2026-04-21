import fs from "fs";
import path from "path";
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

export const uploadsDir = "uploads/";

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    const name = `/${Date.now()}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) return cb(null, true);
  return cb(new Error("Only image files are allowed"));
};

export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter,
}).single("image");

export default uploadImage;
