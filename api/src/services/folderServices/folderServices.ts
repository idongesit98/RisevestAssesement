import prisma from "../../utils/config/database";

export const createFolder = async( name:string,userId:string,parentFolderId:string) =>{
    try {
        const existing = await prisma.folder.findUnique({where:{id:userId}})
        if (existing) {
            return{
                code:400,
                success:false,
                message:"User already exist",
                data:null
            }
        }
        const newFolder = await prisma.folder.create({
            data:{
                name,
                userId,
                parentFolderId: parentFolderId || null
            }
        })

        return{
            code:201,
            success:true,
            message:"Folder created successfully",
            data:{newFolder}
        }
    } catch (error) {
          const errorMessage = (error instanceof Error) ? error.message : "Error creating user"
        return{
            code:500,
            success:true,
            message:errorMessage
        }
    }
}

export const getFolderById = async(id:string) =>{
    try {
        const getFolderById = await prisma.folder.findUnique({
            where:{id},
            include:{
                subfolders:true,
                uploads:true
            }
        })
        if (!getFolderById) {
            return{
                code:404,
                success:true,
                message:"Folder not found",
                data:null
            }
        }

        return{
            code:200,
            success:true,
            message:"Folder found",
            data:{getFolderById}
        }
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Error creating user"
        console.error(errorMessage)
        return{
            code:500,
            success:false,
            message:errorMessage
        }
    }
}
export const listRootFolders = async(userId:string) => {
    try {
        const getAllFolders = await prisma.folder.findMany({
            where:{userId,parentFolderId:null},
            include:{subfolders:true,uploads:true}
        })

        if (getAllFolders.length === 0) {
            return{
                code:404,
                success:true,
                message:"Folder not found",
                data:null
            }
        }

        return{
            code:200,
            success:true,
            message:"Folder found",
            data:{getAllFolders}
        }
    } catch (error) {
         const errorMessage = (error instanceof Error) ? error.message : "Error finding Folders"
         console.error(errorMessage)
        return{
            code:500,
            success:true,
            message:errorMessage
        }
    }
}

export const moveFileToFolder = async(fileId:string,folderId:string,userId:string) => {
     if (!fileId || !folderId || !userId) {
        return {
        code: 400,
        success: false,
        message: "fileId, folderId, and userId are required",
        data: null
        };
    }
    
    try {
        const updatedFile = await prisma.uploadedFiles.update({
            where:{id:fileId},
            data:{folderId}
        })
        await prisma.fileHistory.create({
            data:{
                fileId,
                action:"move",
                userId,
                details:{newFolderId:folderId}
            }
        })
        return{
            code:200,
            success:true,
            message:"File moved successfully",
            data:{updatedFile}
        }
    } catch (error) {
         const errorMessage = (error instanceof Error) ? error.message : "Error moving folders"
         console.error(errorMessage)
        return{
            code:500,
            success:true,
            message:errorMessage
        }
    }
}    


