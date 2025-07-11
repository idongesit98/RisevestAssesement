import cloudinary from "../../utils/config/cloudinary";
import prisma from "../../utils/config/database";
import { redisClient } from "../../utils/config/redis";

export const uploadFileToCloudinary = async (filePath: string, folder: string = "cloud_backup_files") => {
  try {
    const result = await cloudinary.uploader.upload_large(filePath, {
      folder,
      resource_type: "auto",
      chunk_size:6_000_000
    });

      return {
        code:200,
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          size: result.bytes,
          format: result.format,
          resourceType:result.resource_type as ResourceType
        },
        message: "File uploaded to Cloudinary successfully",
      };
      
  } catch (error:any) {
    console.error("Upload Error:", error?.message || error);
    return {
      success: false,
      message: error?.message || "Failed to upload file",
      error:error,
    };
  }
};

export const saveFileRecordToDB = async (options:SaveFileOptions) =>{
    const saveUploadedFile = prisma.uploadedFiles.create({
      data:{
        filename:options.filename,
        key:options.key,
        size:options.size,
        url:options.url,
        publicId:options.publicId,
        resourceType:options.resourceType,
        userId:options.userId,
        folderId:options.folderId || null
      }
    })
    return saveUploadedFile;
}

export const generateCloudinaryDownloadUrl = async (publicId: string,resourceType: ResourceType) => {
    const cacheKey = `cloudinary:signed:${publicId}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
        return { 
            success: true,
            url: cached, 
            fromCache: true 
        };
    }

    try {
        const url = cloudinary.url(publicId, {
            resource_type: resourceType,
            secure: true,
            sign_url: true
        });

        await redisClient.setEx(cacheKey, 300, url); // Cache for 5 minutes

        return {
            success: true,
            url,
            fromCache: false,
        };
    } catch (error) {
        console.error("Cloudinary signed URL error:", error);
        return {
            success: false,
            message: error || "Failed to generate signed URL",
        };
    }
};

export const getAllUploads = async() =>{
    try {
        const allUploads = await prisma.uploadedFiles.findMany({})

        if(allUploads.length === 0){
          return{
            code:404,
            success:false,
            message:"No files available",
            data:null
          }
        }

        return{
          code:200,
          success:true,
          message:"Files available",
          data:{
            allUploads
          }
        };
    } catch (error) {
        return{
          code:500,
          success:false,
          message:error,
          data:null
        }
    }
}

export const markFileUnsafe = async(fileId:string,reason:string,userId:string) =>{
    try {
      if (!fileId) {
        return{
          code:404,
          success:false,
          message:"File not found",
          data:null
        }
      }

      if (!reason || reason.trim() === "") {
        return{
          code:400,
          success:false,
          message:"Reason for marking file unsafe is required"
        }
      }

      const updated = await prisma.uploadedFiles.update({
        where:{id:fileId},
        data:{status:"UNSAFE"},
      })

      await prisma.fileHistory.create({
        data:{
          fileId:fileId,
          action:"mark unsafe",
          id:userId,
          details:{
            reason
          }
        }
      })

      return{
        code:200,
        success:true,
        message:"File marked UNSAFE",
        data:{Unsafe:updated}
      }
    } catch (error) {
      return{
          code:500,
          success:false,
          message:error,
          data:null
        }
    }
}