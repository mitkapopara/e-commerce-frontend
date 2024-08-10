import type { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import path from "path";
import fs from "fs";
import util from "util";

const uploadDir = path.join(process.cwd(), "public/uploads");
const mkdir = util.promisify(fs.mkdir);

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  mkdir(uploadDir, { recursive: true }).catch(console.error);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

// Extend the NextApiRequest type to include the file property added by Multer
interface NextApiRequestWithFile extends NextApiRequest {
  file: Express.Multer.File;
}

export default function handler(
  req: NextApiRequestWithFile,
  res: NextApiResponse
) {
  upload.single("file")(req as any, res as any, (err: any) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ url: imageUrl });
  });
}
