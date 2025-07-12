import cron from 'node-cron'
import prisma from './database'
import cloudinary from './cloudinary'

const deleteUnSafeFile = async () => {
  const unSafeFiles = await prisma.uploadedFiles.findMany({
    where: { status: "UNSAFE" },
  });

  console.log(`Found ${unSafeFiles.length} unsafe files.`);

  for (const file of unSafeFiles) {
    try {
        const result = await cloudinary.uploader.destroy(file.publicId, {resource_type: file.resourceType});

        if (result.result === "ok" || result.result === "not found") {
            await prisma.fileHistory.deleteMany({where: { fileId: file.id }});

            await prisma.uploadedFiles.delete({where: { id: file.id },});
            console.log(`Deleted unsafe file: ${file.filename}`);
        } else {
            console.warn(`Could not delete from Cloudinary: ${file.filename}`, result);
        }
    } catch (error) {
      console.error(`Failed to delete ${file.filename}:`, error);
    }
  }
};


cron.schedule('*/10 * * * * ', async () => {
    console.log("Running unsafe file deletion every 10minutes............")
    await deleteUnSafeFile()
})