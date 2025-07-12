import prisma from "../../utils/config/database";
import cloudinary from "../../utils/config/cloudinary";

export const getStreamingUrl = async (fileId: string) => {
  const file = await prisma.uploadedFiles.findUnique({
    where: { id: fileId },
  });

  if (!file || file.status === "UNSAFE") {
    return {
      code: 404,
      success: false,
      message: "File not found or marked as unsafe",
      data: null,
    };
  }

  const isVideo = file.resourceType === "video";
  const isAudio = file.resourceType === "audio";

  const url = cloudinary.url(file.publicId, {
    resource_type: file.resourceType,
    secure: true,
    sign_url: true,
    ...(isVideo && { format: "mp4" }),
    ...(isAudio && { format: "mp3" }),
    transformation: [
      {
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  });

  return {
    code: 200,
    success: true,
    streamUrl: url,
  };
};
