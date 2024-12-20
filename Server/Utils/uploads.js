import * as cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadSingleImage = async (file) => {
  try {
    const result = await cloudinary.v2.uploader.upload(file.path);

    fs.unlink(file.path, (err) => {
      if (err) {
        console.error("Error deleting file:", err.message);
      } else {
        console.log("Temporary file deleted:", file.path);
      }
    });

    return { imageUrl: result.secure_url };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error("Error deleting file after failed upload:", err.message);
      }
    });

    throw error;
  }
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); // Temporary local storage
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Multer file filter for images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Multer middleware for image uploads
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
});

export { upload };
