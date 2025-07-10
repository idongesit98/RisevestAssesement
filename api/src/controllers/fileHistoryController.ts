import { Request,Response } from "express"
import { getFileHistory } from "../services/fileHistory/fileHistoryService";

export const fileHistory = async(req:Request,res:Response) => {
   try {
     const fileId = req.params.fileId;
 
     const fileResponse = await getFileHistory(fileId)
     res.status(fileResponse.code).json(fileResponse)
   } catch (error) {
        console.error(error)
        res.status(500).json({success:false,message:error})
   }
}