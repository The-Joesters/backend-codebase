import ApiError from "../middlewares/ApiError";
import prisma from "../prisma/prismaClient";

class SummarizationService{

    async summarize(PdfFile:any){
        try{

            return PdfFile;

        }catch(err){
            console.error(err);
            throw new ApiError("Error while creating to the database ",501);
        }
    }    
}

export default new SummarizationService();
