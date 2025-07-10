import { Request,Response } from "express";
import { createFolder, getFolderById, listRootFolders, moveFileToFolder } from "../services/folderServices/folderServices";

export const createFolderHandler = async (req: Request, res: Response) => {
    try {
        const { name, parentFolderId } = req.body;
        const userId = req.user?.id as string;       
        
        const createFolderResponse = await createFolder(name, userId, parentFolderId);
    
        res.status(createFolderResponse.code).json({createFolderResponse});
    } catch (error) {
        console.error(error)
        res.status(500).json({success:false,message:error})
    }
};

export const getFolder = async(req:Request,res:Response) =>{
   try {
     const folderId = req.params.folderId

     if (!folderId) {
        res.status(400).json({success:false,message:"Folder ID is required"})
     }
     
     const folderResponse = await getFolderById(folderId)
     res.status(folderResponse.code).json(folderResponse)
   } catch (error) {
        console.error(error)
        res.status(500).json({success:false,message:error})
   }
}

export const listFolder = async(req:Request,res:Response) => {
    try {
        const userId = req.user?.id as string;
    
        const allFolderResponse = await listRootFolders(userId)
        res.status(allFolderResponse.code).json(allFolderResponse);
    } catch (error) {
         console.error(error)
        res.status(500).json({success:false,message:error})
    }
}

export const moveFile = async (req:Request,res:Response) => {
     try {
        const {fileId,folderId} = req.body
        const userId = req.user?.id as string;
         if (!fileId || !folderId) {
            res.status(400).json({success: false,message: "fileId and folderId are required"});
            return;
        }
        const fileResponse = await moveFileToFolder(fileId,folderId,userId)
            
        res.status(fileResponse.code).json(fileResponse)
    } catch (error) {
        console.error(error)
        res.status(500).json({success:false,message:error})
    }
}