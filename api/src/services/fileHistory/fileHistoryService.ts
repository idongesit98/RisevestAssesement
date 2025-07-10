import prisma from "../../utils/config/database";

export const getFileHistory = async(fileId:string) => {
    try {
        const getHistory = await prisma.fileHistory.findMany({
            where:{fileId},
            orderBy:{timeStamp:'desc'}
        })

        if (getHistory.length === 0) {
            return{
                code:404,
                success:false,
                message:"No history present",
                data:null
            }
        }

        return{
            code:200,
            success:true,
            message:"File History found",
            data:{getHistory}
        }
    } catch (error) {
         const errorMessage = (error instanceof Error) ? error.message : "Error finding History"
        return{
            code:500,
            success:false,
            message:errorMessage
        }
    }
}
