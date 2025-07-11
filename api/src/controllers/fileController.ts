import { Request,Response } from "express";
import { generateCloudinaryDownloadUrl, getAllUploads, markFileUnsafe, saveFileRecordToDB, uploadFileToCloudinary } from "../services/fileServices/fileServices";
import prisma from "../utils/config/database";

export const uploadFile = async (req:Request,res:Response) => {
    if (!req.file) {
        res.status(400).json({success:false,message:"No file uploaded"})
        return;
    }
    console.log(req.file)

    //  if (!req.user) {
    //     res.status(401).json({success:false,message:"Unauthorized"})
    //     return;
    // }
    
    const filePath = req.file.path;
    console.log(filePath)
    const result = await uploadFileToCloudinary(filePath);

    if (!result.success || !result.data) {
        res.status(500).json({
            success:false,
            message:result.message || "Upload failed",
            error: result.error instanceof Error ? result.error.message : JSON.stringify(result.error)
        });
        return;
    }

    const { url, publicId, size, resourceType } = result.data

    const savedFile = await saveFileRecordToDB({
        filename:req.file.originalname,
        key:req.file.filename,
        size,
        url,
        publicId,
        resourceType,
        userId: req.user!.id,
        folderId:req.body.folderId
    })
    res.status(200).json({success:true, data:savedFile});
    return;
}

export const downloadFileFromCloud = async (req:Request,res:Response) => {
   try {

     const encodedId = req.params.publicId;
     const publicId = decodeURIComponent(encodedId).trim();
 
     if (!publicId) {
         res.status(400).json({success:false,message:"Missing PublicId"})
         return;
     }

     const file = await prisma.uploadedFiles.findFirst({
        where:{publicId},
     })
     console.log("File returned:", file)

     if (!file) {
        res.status(404).json({success:false,message:"File not found"});
        return;
     }
 
     const result = await generateCloudinaryDownloadUrl(publicId, file.resourceType as "raw" | "image" | "video");
 
     if (!result.success) {
         res.status(500).json(result);
         return;
     }
 
     res.status(200).json(result);
   } catch (error) {
        console.error("Download error:", error);
        res.status(500).json({ success: false, message: "Server error", error });  
        return;  
   }
}

export const getAll = async(req:Request,res:Response) =>{
    const uploadsResponse = await getAllUploads()
    res.status(uploadsResponse.code).json(uploadsResponse)
}

export const markedFile = async(req:Request,res:Response) =>{
    try {
        const fileId = req.params.fileId
        const userId = req.user?.id as string
        const {reason} = req.body
    
        if (!fileId) {
            res.status(404).json({success:false,message:"No FileId present, please provide an available fileID"})
        }
    
        const markResponse = await markFileUnsafe(fileId,reason,userId)
        res.status(markResponse.code).json(markResponse)
    } catch (error) {
        console.error("Marked File error:", error);
        res.status(500).json({ success: false, message: "Server error", error });  
        return; 
    }
}