import cron from 'node-cron'
import prisma from './database'
import cloudinary from './cloudinary'

const deleteUnSafeFile = async() =>{
    const unSafeFile = await prisma.uploadedFiles.findMany({
        where:{status:"UNSAFE"}
    });

    for(const file of unSafeFile){
        try {
            await cloudinary.uploader.destroy(file.publicId,{resource_type:file.resourceType});

            await prisma.uploadedFiles.delete({where:{id:file.id}});
            console.log(`Deleted unsafe file: ${file.filename}`);
            console.log(`Found ${unSafeFile.length} unsafe files.`);

        } catch (error) {
            console.error(`Failed to delete ${file.filename}:`,error);
        }
    }
}

cron.schedule('*/10 * * * * *', async () => {
    console.log("Running unsafe file deletion every 10minutes............")
    await deleteUnSafeFile()
})