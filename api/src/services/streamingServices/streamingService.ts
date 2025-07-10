import prisma from "../../utils/config/database";
import cloudinary from "../../utils/config/cloudinary";

export const getStreamingUrl = async(fileId:string) =>{
    const file = await prisma.uploadedFiles.findUnique({
        where:{id:fileId},
    });

    if(!file || file.status === 'UNSAFE'){
        return{
            code:404,
            success:false,
            message:"File not found or marked as unsafe",
            data:null
        }
    }

    const url = cloudinary.url(file.publicId,{
        resource_type:file.resourceType,
        secure:true,
        sign_url:true,
        format:"mp4",
        transformation:[
            {
                quality:"auto",
                fetch_format:"auto"
            },
        ],
    });

    return{
        code:200,
        success:true,
        streamUrl:url
    }
}