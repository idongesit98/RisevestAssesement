import { Request,Response } from "express";
import { getStreamingUrl } from "../services/streamingServices/streamingService";


export const streamFileHandler = async(req:Request,res:Response) =>{
    try {
        const fileId = req.params.fileId;
        if (!fileId) {
            res.status(404).json({success:false,message:"FileID not found please add a valid ID"})
            return;
        }

        const streamingResponse = await getStreamingUrl(fileId)
        res.status(streamingResponse.code).json(streamingResponse);
    } catch (error) {
        console.error("Streaming File error:", error);
        res.status(500).json({ success: false, message: "Server error", error });  
        return; 
    }
}