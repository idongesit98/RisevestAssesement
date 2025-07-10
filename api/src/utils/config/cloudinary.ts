import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
   params: async () => ({
    folder: "cloud_backup_files",
    allowed_formats: ["jpg", "png", "jpeg", "pdf", "docx", "zip","mp4", "mov", "avi", "mkv","mp3", "wav", "aac"],
    resource_type: "auto",
  }),
});


export const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter:(req,file,cb) => {
    const allowedMimeTypes = [
       "image/jpeg", "image/png", "image/jpg",
      "application/pdf", "application/zip",
      "video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska",
      "audio/mpeg", "audio/wav", "audio/aac"
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null,true);
    }else{
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE") as any, false); 
    }
  }
});

export default cloudinary;
