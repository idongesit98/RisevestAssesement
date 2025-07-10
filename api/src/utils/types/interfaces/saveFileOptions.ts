
type ResourceType = "image" | "video" | "raw";

interface SaveFileOptions{
    filename:string;
    key:string;
    size:number;
    url?:string;
    publicId:string;
    resourceType: ResourceType
    userId:string;
    folderId?:string;
}

