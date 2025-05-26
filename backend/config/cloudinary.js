import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ticketease', // The name of the folder in cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // Allowed formats
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }] // Optional: limit image size
  }
});

// Create multer upload instance
const upload = multer({ storage: storage });

export { cloudinary, upload }; 